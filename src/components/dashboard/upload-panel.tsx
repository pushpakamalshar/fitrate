"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ImageUp,
  Loader2,
  Share2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { OCCASIONS, type OccasionId } from "@/lib/occasions";
import type { AnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Status = "idle" | "ready" | "analyzing" | "result";
type PublishState = "private" | "publishing" | "public";

const MAX_FILE_BYTES = 15 * 1024 * 1024;

const CATEGORY_ROWS: { key: "colorHarmony" | "fit" | "style" | "accessories"; label: string }[] = [
  { key: "colorHarmony", label: "Color Harmony" },
  { key: "fit", label: "Fit" },
  { key: "style", label: "Style" },
  { key: "accessories", label: "Accessories" },
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function UploadPanel({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<OccasionId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [fitcheckId, setFitcheckId] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<PublishState>("private");

  async function acceptFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, or WEBP).");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Image is too large. Max size is 15MB.");
      return;
    }
    setError(null);
    const dataUrl = await readFileAsDataUrl(file);
    setImageDataUrl(dataUrl);
    setStatus("ready");
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    void acceptFile(e.dataTransfer.files?.[0]);
  }

  function handleReset() {
    setImageDataUrl(null);
    setStatus("idle");
    setError(null);
    setAnalysis(null);
    setFitcheckId(null);
    setPublishState("private");
  }

  async function handleAnalyze() {
    if (!imageDataUrl || !occasion) return;
    setStatus("analyzing");
    setError(null);

    try {
      const res = await fetch("/api/fitchecks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl, occasion }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong analyzing your fit.");
      }

      setAnalysis(data.analysis as AnalysisResult);
      setFitcheckId((data.fitcheck as { id: string }).id);
      setPublishState("private");
      setStatus("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("ready");
    }
  }

  async function handlePublish() {
    if (!fitcheckId) return;
    setPublishState("publishing");

    try {
      const res = await fetch(`/api/fitchecks/${fitcheckId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: "public" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't post to community.");
      }

      setPublishState("public");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post to community.");
      setPublishState("private");
    }
  }

  const hasImage = status !== "idle";
  const canAnalyze = hasImage && occasion !== null && status !== "analyzing" && status !== "result";

  return (
    <Card className={cn("rounded-3xl border-border/80 shadow-sm", className)}>
      <CardContent className="flex flex-col gap-6 px-5 py-2 sm:px-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl tracking-tight">Rate a fit</h2>
          <p className="text-sm text-muted-foreground">
            Upload a full-body photo and get an instant AI breakdown.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            What are you dressing for?
          </span>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                disabled={status === "analyzing" || status === "result"}
                onClick={() => setOccasion(o.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  occasion === o.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            {!hasImage ? (
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    (e.currentTarget.querySelector("input") as HTMLInputElement)?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex aspect-4/5 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/40 px-6 text-center transition-colors",
                  dragActive && "border-foreground/40 bg-muted"
                )}
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-background ring-1 ring-border">
                  <UploadCloud className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Drag & drop your outfit photo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse · JPG, PNG, WEBP up to 15MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void acceptFile(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageDataUrl ?? undefined}
                  alt="Uploaded outfit preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Remove photo"
                  disabled={status === "analyzing"}
                  className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background disabled:pointer-events-none disabled:opacity-50"
                >
                  <X className="size-4" />
                </button>
                {status !== "analyzing" && status !== "result" && (
                  <label className="absolute bottom-3 left-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-background">
                    <ImageUp className="size-3.5" />
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => void acceptFile(e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>
            )}

            {error && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="mt-4 h-12 w-full rounded-full text-base"
            >
              {status === "analyzing" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing your fit…
                </>
              ) : status === "result" ? (
                <>
                  <Sparkles className="size-4" />
                  Rated
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  {occasion ? "Get my rating" : "Pick an occasion first"}
                </>
              )}
            </Button>

            {status === "result" && (
              <>
                <Button
                  onClick={handlePublish}
                  disabled={publishState !== "private"}
                  variant="outline"
                  className="mt-3 h-11 w-full rounded-full text-sm"
                >
                  {publishState === "publishing" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Posting…
                    </>
                  ) : publishState === "public" ? (
                    <>
                      <Check className="size-4" />
                      Posted to community
                    </>
                  ) : (
                    <>
                      <Share2 className="size-4" />
                      Post to community
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Rate another fit
                </button>
              </>
            )}
          </div>

          <div className="flex min-h-70 flex-col justify-center rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {status === "analyzing" ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-4 py-8 text-center"
                >
                  <motion.span
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="size-6 text-muted-foreground" />
                  </motion.span>
                  <p className="text-sm text-muted-foreground">
                    Reading color, fit, and silhouette…
                  </p>
                  <div className="w-full max-w-55">
                    <Progress value={null} />
                  </div>
                </motion.div>
              ) : status === "result" && analysis ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Overall score
                    </span>
                    <div className="mt-1 font-serif text-4xl leading-none">
                      {analysis.overallScore.toFixed(1)}
                    </div>
                  </div>

                  {analysis.photoQualityNote && (
                    <p className="text-xs text-muted-foreground">{analysis.photoQualityNote}</p>
                  )}

                  <div className="flex flex-col gap-4">
                    {CATEGORY_ROWS.map((row) => {
                      const category = analysis[row.key];
                      return (
                        <div key={row.key} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-3">
                            <span className="w-24 shrink-0 text-xs text-muted-foreground">
                              {row.label}
                            </span>
                            <Progress value={category.score * 10} className="flex-1">
                              <span className="sr-only">{row.label}</span>
                            </Progress>
                            <span className="w-7 shrink-0 text-right text-xs font-medium tabular-nums">
                              {category.score.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/80">{category.reason}</p>
                          <p className="text-xs text-muted-foreground">→ {category.improvement}</p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {analysis.summary}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-3 py-8 text-center text-muted-foreground"
                >
                  <Sparkles className="size-6 opacity-40" />
                  <p className="max-w-55 text-sm">
                    Your color, fit, and style breakdown will appear here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
