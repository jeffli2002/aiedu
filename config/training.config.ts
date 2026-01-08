const DEFAULT_FREE_VIDEO_PREVIEW_PERCENT = 20;

const rawPreviewPercent = Number(
  process.env.NEXT_PUBLIC_TRAINING_VIDEO_PREVIEW_PERCENT ?? DEFAULT_FREE_VIDEO_PREVIEW_PERCENT
);

const normalizedPreviewPercent = Number.isFinite(rawPreviewPercent)
  ? Math.min(100, Math.max(0, rawPreviewPercent))
  : DEFAULT_FREE_VIDEO_PREVIEW_PERCENT;

export const trainingConfig = {
  freeVideoPreviewPercent: normalizedPreviewPercent,
};
