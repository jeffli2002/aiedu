import { NextResponse } from 'next/server';
import { r2StorageService } from '@/lib/storage/r2';
import { Readable } from 'node:stream';

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

/**
 * Public thumbnail fetcher by R2 key.
 * GET /api/media/thumbnail?key=<r2-key>
 * Streams the image with long-lived public caching.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key') || '';
    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    // Basic allowlist to avoid arbitrary bucket reads
    if (!/^((docs|videos)\/)\S+\.(png|jpg|jpeg|webp)$/i.test(key)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    const asset = await r2StorageService.getAsset(key);
    const { body, contentType } = asset;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = (body as any)?.pipe
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? Readable.toWeb(body as any)
      : (body as ReadableStream<Uint8Array>);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Response(stream as any, {
      status: 200,
      headers: {
        'Content-Type': contentType || (key.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch thumbnail', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
