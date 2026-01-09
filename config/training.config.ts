const DEFAULT_FREE_VIDEO_PREVIEW_PERCENT = 20;
const DEFAULT_VIDEO_COURSE_CREDIT_COST = 0;

const rawPreviewPercent = Number(
  process.env.NEXT_PUBLIC_TRAINING_VIDEO_PREVIEW_PERCENT ?? DEFAULT_FREE_VIDEO_PREVIEW_PERCENT
);

const rawVideoCourseCreditCost = Number(
  process.env.NEXT_PUBLIC_TRAINING_VIDEO_COURSE_CREDIT_COST ?? DEFAULT_VIDEO_COURSE_CREDIT_COST
);

const normalizedPreviewPercent = Number.isFinite(rawPreviewPercent)
  ? Math.min(100, Math.max(0, rawPreviewPercent))
  : DEFAULT_FREE_VIDEO_PREVIEW_PERCENT;

const normalizedVideoCourseCreditCost = Number.isFinite(rawVideoCourseCreditCost)
  ? Math.max(0, rawVideoCourseCreditCost)
  : DEFAULT_VIDEO_COURSE_CREDIT_COST;

const videoCourseCreditOverrides: Record<string, number> = {};

export const trainingConfig = {
  freeVideoPreviewPercent: normalizedPreviewPercent,
  videoCourseCreditCost: normalizedVideoCourseCreditCost,
  videoCourseCreditOverrides,
};

export function getTrainingVideoCourseCreditCost(courseId: string): number {
  const override = trainingConfig.videoCourseCreditOverrides[courseId];
  if (Number.isFinite(override)) {
    return Math.max(0, override);
  }

  return trainingConfig.videoCourseCreditCost;
}
