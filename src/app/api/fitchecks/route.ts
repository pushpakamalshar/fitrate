import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { analyzeOutfit, AnalysisError } from "@/lib/ai/analyze-outfit";
import { OCCASIONS, type OccasionId } from "@/lib/occasions";
import type { AnalysisResult, Fitcheck } from "@/types/analysis";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=]+)$/;

function parseDataUrl(dataUrl: string) {
  const match = DATA_URL_PATTERN.exec(dataUrl);
  if (!match) return null;

  const [, extRaw, base64] = match;
  const ext = extRaw === "jpg" ? "jpeg" : extRaw;
  const buffer = Buffer.from(base64, "base64");

  return { buffer, contentType: `image/${ext}`, ext };
}

export async function POST(request: Request) {
  let body: { image?: unknown; occasion?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { image, occasion } = body;

  if (typeof occasion !== "string" || !OCCASIONS.some((o) => o.id === occasion)) {
    return NextResponse.json({ error: "A valid occasion is required." }, { status: 400 });
  }
  if (typeof image !== "string") {
    return NextResponse.json({ error: "An image is required." }, { status: 400 });
  }

  const parsedImage = parseDataUrl(image);
  if (!parsedImage) {
    return NextResponse.json(
      { error: "Image must be a JPG, PNG, or WEBP data URL." },
      { status: 400 }
    );
  }
  if (parsedImage.buffer.byteLength > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image is too large. Max size is 15MB." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const occasionId = occasion as OccasionId;

  let analysis: AnalysisResult;
  try {
    analysis = await analyzeOutfit({ imageDataUrl: image, occasion: occasionId });
  } catch (error) {
    if (error instanceof AnalysisError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    throw error;
  }

  const path = `${user.id}/${randomUUID()}.${parsedImage.ext}`;
  const { error: uploadError } = await supabase.storage
    .from("fitchecks")
    .upload(path, parsedImage.buffer, { contentType: parsedImage.contentType });

  if (uploadError) {
    return NextResponse.json(
      { error: `Failed to store image: ${uploadError.message}` },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("fitchecks").getPublicUrl(path);

  const { data: fitcheckRow, error: fitcheckError } = await supabase
    .from("fitchecks")
    .insert({
      user_id: user.id,
      image_url: publicUrl,
      occasion: occasionId,
      visibility: "private",
    })
    .select("id, user_id, image_url, occasion, visibility, created_at")
    .single();

  if (fitcheckError || !fitcheckRow) {
    await supabase.storage.from("fitchecks").remove([path]);
    return NextResponse.json(
      { error: `Failed to save fitcheck: ${fitcheckError?.message ?? "unknown error"}` },
      { status: 500 }
    );
  }

  const { error: analysisError } = await supabase.from("analyses").insert({
    fitcheck_id: fitcheckRow.id,
    overall_score: analysis.overallScore,
    photo_quality_note: analysis.photoQualityNote,
    color_score: analysis.colorHarmony.score,
    color_reason: analysis.colorHarmony.reason,
    color_improvement: analysis.colorHarmony.improvement,
    fit_score: analysis.fit.score,
    fit_reason: analysis.fit.reason,
    fit_improvement: analysis.fit.improvement,
    style_score: analysis.style.score,
    style_reason: analysis.style.reason,
    style_improvement: analysis.style.improvement,
    accessory_score: analysis.accessories.score,
    accessory_reason: analysis.accessories.reason,
    accessory_improvement: analysis.accessories.improvement,
    summary: analysis.summary,
  });

  if (analysisError) {
    await supabase.from("fitchecks").delete().eq("id", fitcheckRow.id);
    await supabase.storage.from("fitchecks").remove([path]);
    return NextResponse.json(
      { error: `Failed to save analysis: ${analysisError.message}` },
      { status: 500 }
    );
  }

  const fitcheck: Fitcheck = {
    id: fitcheckRow.id,
    userId: fitcheckRow.user_id,
    imageUrl: fitcheckRow.image_url,
    occasion: fitcheckRow.occasion,
    visibility: fitcheckRow.visibility,
    createdAt: fitcheckRow.created_at,
  };

  return NextResponse.json({ fitcheck, analysis }, { status: 201 });
}
