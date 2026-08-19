import { getOccasion, type OccasionId } from "@/lib/occasions";
import type { AnalysisResult } from "@/types/analysis";

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

type OpenAIChatResponse = {
  choices: { message: { content: string | null } }[];
};

type RawCategory = {
  score: number;
  reason: string;
  improvement: string;
};

/** Raw JSON shape we ask the model for — narrower keys, expanded into AnalysisResult after validation. */
type RawAnalysis = {
  photo_quality_note: string | null;
  color_harmony: RawCategory;
  fit: RawCategory;
  style: RawCategory;
  accessories: RawCategory;
  overall_summary: string;
};

export class AnalysisError extends Error {}

function buildPrompt(occasionId: OccasionId): string {
  const occasion = getOccasion(occasionId);

  return `You are FitRate's outfit analyst, an experienced fashion stylist.

The person is dressing for: ${occasion.prompt}. Evaluate the outfit against this context.

Evaluate only what is clearly visible. Never guess.

Steps:
1. Identify visible garments, colors, fit, footwear, and accessories.
2. If blur, lighting, crop, or angle prevents judging something, mention it and score only visible elements.

Score (1.0–10.0, one decimal):
- color_harmony: how colors work together.
- fit: garment proportions, tailoring, length, intended silhouette.
- style: overall cohesion and suitability for the stated occasion.
- accessories: impact of visible shoes, bags, jewelry, belts, hats, watches. If none are visible, judge whether the outfit would benefit from them.

Scoring guide:
- 9.0–10.0: exceptional, difficult to improve.
- 7.5–8.9: strong with minor issues.
- 5.5–7.4: decent with clear improvements.
- 3.5–5.4: significant styling issues.
- <3.5: major problems.
Most outfits should score 5.0–7.5. Do not inflate scores.

Rules:
- Give a specific visible reason for each score.
- Give exactly one actionable improvement per category.
- Critique clothing, never the person's body or attractiveness.

Respond only as valid JSON, no markdown, no commentary, matching exactly this shape:
{
  "photo_quality_note": "string|null",
  "color_harmony": { "score": 0.0, "reason": "", "improvement": "" },
  "fit": { "score": 0.0, "reason": "", "improvement": "" },
  "style": { "score": 0.0, "reason": "", "improvement": "" },
  "accessories": { "score": 0.0, "reason": "", "improvement": "" },
  "overall_summary": ""
}`;
}

function isValidCategory(value: unknown): value is RawCategory {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.score === "number" &&
    typeof v.reason === "string" &&
    typeof v.improvement === "string"
  );
}

function isValidRawAnalysis(value: unknown): value is RawAnalysis {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.photo_quality_note !== "string" && v.photo_quality_note !== null) return false;
  if (!isValidCategory(v.color_harmony)) return false;
  if (!isValidCategory(v.fit)) return false;
  if (!isValidCategory(v.style)) return false;
  if (!isValidCategory(v.accessories)) return false;
  if (typeof v.overall_summary !== "string") return false;
  return true;
}

export async function analyzeOutfit({
  imageDataUrl,
  occasion,
}: {
  imageDataUrl: string;
  occasion: OccasionId;
}): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AnalysisError("OPENAI_API_KEY is not configured on the server.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildPrompt(occasion) },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new AnalysisError(
      `AI analysis failed (${response.status}): ${errorBody.slice(0, 300)}`
    );
  }

  const data = (await response.json()) as OpenAIChatResponse;
  const content = data.choices[0]?.message.content;
  if (!content) {
    throw new AnalysisError("AI analysis returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new AnalysisError("AI analysis returned malformed JSON.");
  }

  if (!isValidRawAnalysis(parsed)) {
    throw new AnalysisError("AI analysis response did not match the expected shape.");
  }

  const overallScore =
    Math.round(
      ((parsed.color_harmony.score +
        parsed.fit.score +
        parsed.style.score +
        parsed.accessories.score) /
        4) *
        10
    ) / 10;

  return {
    overallScore,
    photoQualityNote: parsed.photo_quality_note,
    colorHarmony: parsed.color_harmony,
    fit: parsed.fit,
    style: parsed.style,
    accessories: parsed.accessories,
    occasion,
    summary: parsed.overall_summary,
  };
}
