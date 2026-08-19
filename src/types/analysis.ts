import type { OccasionId } from "@/lib/occasions";

export type AnalysisCategory = {
  score: number;
  reason: string;
  improvement: string;
};

export type AnalysisResult = {
  overallScore: number;
  photoQualityNote: string | null;
  colorHarmony: AnalysisCategory;
  fit: AnalysisCategory;
  style: AnalysisCategory;
  accessories: AnalysisCategory;
  occasion: OccasionId;
  summary: string;
};

export type Fitcheck = {
  id: string;
  userId: string;
  imageUrl: string;
  occasion: OccasionId;
  visibility: "private" | "public";
  createdAt: string;
};

export type FitcheckWithAnalysis = Fitcheck & {
  analysis: AnalysisResult;
};

export type FitcheckSummary = {
  id: string;
  imageUrl: string;
  occasion: OccasionId;
  visibility: "private" | "public";
  createdAt: string;
  overallScore: number | null;
};
