# Training Media: IDs, Storage, Thumbnails, and Routing

This document describes the agreed rules for training course IDs, local file storage, R2 object layout, thumbnail generation, and how landing pages map media to the web.

## Course IDs

- Format: `<module><series><course>` → multi‑digit, e.g. `f101`, `c201`, `e301`, `v401`.
  - `f` = AI Foundations, `c` = Modality/Creation, `e` = Efficiency, `v` = Vibe Coding (Web).
  - `series` is the module index (1..4) and `course` is a 2‑digit sequence per module.
- Legacy short IDs (e.g. `f1`, `c2`) are normalized client‑side to new IDs (e.g. `f101`, `c202`). See `app/training/[courseId]/page.tsx:22`.

## Local Workspace Structure

- Root training materials live under `training/` with human‑readable module folders:
  - `training/AI Foundations/<courseId>/<locale>/...`
  - `training/Modality Creation/<courseId>/<locale>/...`
  - Each course can have multiple materials (PDFs and/or videos) displayed on the same landing page.
- Filenames (ASCII slugs): `<slug>_Tnn.<ext>`
  - Examples:
    - `ai-evolution-story_T01.pdf`
    - `ai-llm-evolution_T01.mp4`
  - Local thumbnails (optional to keep): `<slug>_Tnn_thumb.(jpg|png)` — used only as the source when uploading to R2.
- Locale subfolders are required because materials are locale‑specific and can diverge:
  - `training/<Module Name>/<courseId>/<locale>/...`
  - Current locales: `zh`, `en` (more can be added later).

## R2 Storage Layout (Canonical)

The app resolves media by a concise mediaId: `training/<courseId>/<locale>/<slug>_Tnn`.
From that mediaId, API routes map to R2 keys:

- PDFs
  - Full document: `docs/training/<courseId>/<locale>/<slug>_Tnn/full.pdf`
  - Preview document (optional): `docs/training/<courseId>/<locale>/<slug>_Tnn/preview.pdf`
  - Thumbnail: `docs/training/<courseId>/<locale>/<slug>_Tnn/thumb.(jpg|png)`
- Videos
  - HLS master (optional): `videos/training/<courseId>/<locale>/<slug>_Tnn/master.m3u8`
  - Preview HLS (optional): `videos/training/<courseId>/<locale>/<slug>_Tnn/preview.m3u8`
  - Full MP4 fallback: `videos/training/<courseId>/<locale>/<slug>_Tnn/full.mp4`
  - Thumbnail: `videos/training/<courseId>/<locale>/<slug>_Tnn/thumb.(jpg|png)`

Notes:
- JPG is preferred for thumbnails; PNG is accepted as a fallback.
- Keep R2 keys ASCII only (no spaces or non‑ASCII in folder/file names).

## Thumbnails

- Video thumbnails: first representative frame at 1280×720, letterboxed if needed.
  - ffmpeg filter: `thumbnail,scale=1280:-1:flags=lanczos:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black`
- PDF thumbnails: render page 1 and letterbox to 1280×720 (white padding).
  - Requires `pdftoppm` (poppler‑utils) + `ffmpeg` for scaling/padding.
- Upload thumbnails to R2 as `thumb.jpg` (or `thumb.png`).

Helper scripts in `scripts/`:
- Generate and upload thumbnails via API (same‑origin):
  - `pnpm tsx scripts/generate-thumbnails.ts training` (scans for .mp4/.pdf)
- Upload existing local files to specific R2 keys:
  - `node scripts/upload-static-asset.js "<local>=<r2-key>" [...more]`
  - `node scripts/upload-static-thumbnail.js "<local>=<r2-key>" [...more]`

Examples:
- `node scripts/upload-static-asset.js "training/AI Foundations/f101/zh/ai-evolution-story_T01.pdf=docs/training/f101/zh/ai-evolution-story_T01/full.pdf"`
- `node scripts/upload-static-asset.js "training/Modality Creation/c201/zh/ai-image-generation-analysis_T01.mp4=videos/training/c201/zh/ai-image-generation-analysis_T01/full.mp4"`
- `node scripts/upload-static-thumbnail.js "training/Modality Creation/c201/zh/ai-image-generation-analysis_T01_thumb.jpg=videos/training/c201/zh/ai-image-generation-analysis_T01/thumb.jpg"`

## Landing Pages and URL Mapping

- Locale‑prefixed canonical URLs: `/{locale}/training` and `/{locale}/training/{courseId}`.
  - `locale` is `en` or `zh`. Middleware keeps the prefix in the browser, rewrites internally.
- Course list (links): `components/TrainingPageContent.tsx` generates `/{lang}/training/{id}`.
- Course landing page: `app/training/[courseId]/page.tsx` resolves the course from `TRAINING_SYSTEM` by current language.
- Materials on a course page are defined in `lib/training-system.ts` as:
  - `{ id, title, type: 'pdf'|'video', mediaId: 'training/<courseId>/<locale>/<slug>_Tnn', language }`
  - No `thumbKey` is needed — UI always uses normalized thumbnail endpoints.

### Media API → R2 Mapping

- PDF Asset
  - Thumbnail (public): `/api/media/pdf/<mediaId>?thumb=1`
  - Document (auth gate or entitlement): `/api/media/pdf/<mediaId>?authOnly=1`
- Video Asset
  - Thumbnail (public): `/api/media/video/<mediaId>/manifest?thumb=1`
  - Manifest/MP4 (auth gate or entitlement): `/api/media/video/<mediaId>/manifest?authOnly=1`

Endpoints stream same‑origin to avoid CORS and control cache/content headers. Internally they fetch from R2 using the key rules above.

## Authentication and Redirects

- Unauthenticated users clicking a material are redirected to `/signin?callbackUrl=<current page>` and returned to the same course page after login.
  - See `components/auth/auth-provider.tsx` and `hooks/use-login.ts`.
- Entitlement:
  - `authOnly=1` allows access when signed in.
  - Without `authOnly`, endpoints may enforce premium entitlement (full vs preview).

## Migration Notes

- Old c101 assets for “AI 绘画解锁想象力” are standardized under `c201`.
  - PDF mediaId: `training/c201/zh/ai-drawing-unlock-imagination_T01`
  - Video mediaId: `training/c201/zh/ai-image-generation-analysis_T01`
- The PDF endpoint contains a temporary backward‑compat fallback from `c201` → `c101` if the new key is missing in R2. See `app/api/media/pdf/[id]/route.ts:45`.

## Operational Checklist

- For a new course:
  1) Choose ID (e.g., `c205`) and place files locally under `training/<Module Name>/<courseId>/<locale>/`.
  2) Name files `<slug>_Tnn.(pdf|mp4)`; create thumbs if available.
  3) Upload to R2 using the canonical keys (docs/videos, see above).
  4) Add course/material entries to `lib/training-system.ts` with `mediaId` only.
  5) Verify thumbnails: open `/api/media/pdf/<id>?thumb=1` or `/api/media/video/<id>/manifest?thumb=1`.
  6) Verify page: `/{locale}/training/{courseId}` lists all materials on one landing page.

## References

- middleware and locale utils: `middleware.ts:6`, `i18n/locale-utils.ts:1`
- Course list UI: `components/TrainingPageContent.tsx:1`
- Course landing UI: `components/CourseLandingPage.tsx:1`
- Training config: `lib/training-system.ts:1`
- PDF API: `app/api/media/pdf/[id]/route.ts:1`
- Video manifest API: `app/api/media/video/[id]/manifest/route.ts:1`
- Thumbnail API: `app/api/media/thumbnail/route.ts:1`
- Auth redirect handler: `components/auth/auth-provider.tsx:1`, `hooks/use-login.ts:1`

