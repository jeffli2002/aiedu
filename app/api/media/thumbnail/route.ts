import { NextResponse } from 'next/server';
import { r2StorageService } from '@/lib/storage/r2';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate and cache a thumbnail for a media file stored in R2.
 * This endpoint expects you to send base64 image content from the client or a processing job,
 * because Next.js Edge runtime cannot run ffmpeg/pdf renderers.
 *
 * Body JSON:
 * {
 *   key: string;          // target key to save thumbnail to, e.g. "docs/training/ID/thumb.jpg"
 *   content: string;      // base64-encoded image (JPEG/PNG)
 *   contentType?: string; // optional, default image/jpeg
 *   cacheControl?: string // optional cache control
 * }
 */
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      key?: string;
      content?: string;
      contentType?: string;
      cacheControl?: string;
    };

    if (!payload?.key || !payload?.content) {
      return NextResponse.json({ error: 'Missing key or content' }, { status: 400 });
    }

    const base64 = payload.content.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const contentType = payload.contentType || 'image/jpeg';
    const cacheControl = payload.cacheControl || 'public, max-age=31536000, immutable';

    const result = await r2StorageService.uploadToKey(payload.key, buffer, contentType, cacheControl);
    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save thumbnail', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

