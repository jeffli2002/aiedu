import { auth } from '@/lib/auth/auth';
import { isEntitledForPremium } from '@/lib/access/entitlement';
import { getTrainingVideoAccess } from '@/lib/training-system';
import { NextResponse } from 'next/server';
import { r2StorageService } from '@/lib/storage/r2';
import { Readable } from 'node:stream';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Environment layout for R2 public CDN
// Example structure:
// - videos/<id>/master.m3u8
// - videos/<id>/preview.m3u8
const PUBLIC_CDN = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const encoded = params.id;
    const id = decodeURIComponent(encoded);
    if (!id) {
      return NextResponse.json({ error: 'Missing video id' }, { status: 400 });
    }

    if (!PUBLIC_CDN) {
      return NextResponse.json({ error: 'R2_PUBLIC_URL not configured' }, { status: 500 });
    }

    const url = new URL(request.url);
    // Public thumbnail (no auth required) - stream same-origin and support jpg/png
    if (url.searchParams.get('thumb') === '1' || url.searchParams.get('thumb') === 'true') {
      const baseKey = `videos/${id}`;
      let key = `${baseKey}/thumb.jpg`;
      let asset;
      try {
        asset = await r2StorageService.getAsset(key);
      } catch {
        key = `${baseKey}/thumb.png`;
        asset = await r2StorageService.getAsset(key);
      }
      const { body, contentType } = asset;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stream = (body as any)?.pipe ? Readable.toWeb(body as any) : (body as ReadableStream<Uint8Array>);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Response(stream as any, {
        status: 200,
        headers: {
          'Content-Type': contentType || (key.endsWith('.png') ? 'image/png' : 'image/jpeg'),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const authOnly = url.searchParams.get('authOnly') === '1' || url.searchParams.get('authOnly') === 'true';

    const trainingAccess = getTrainingVideoAccess(id);
    if (!trainingAccess && id.includes('training/')) {
      console.warn(`[Training] Missing video access tag for ${id}`);
    }

    // Check session
    const session = await auth.api.getSession({ headers: request.headers });
    const isAuthed = Boolean(session?.user?.id);
    let entitled = false;
    if (authOnly) {
      entitled = isAuthed; // auth-only gating
    } else {
      entitled = isAuthed
        ? await isEntitledForPremium(session!.user!.id, session!.user!.email)
        : false;
    }

    if (!entitled && authOnly && !isAuthed) {
      const reqUrl = new URL(request.url);
      const origin = process.env.NEXT_PUBLIC_APP_URL || reqUrl.origin;
      const referer = request.headers.get('referer') || `${origin}/`;
      const loginAbs = `${origin.replace(/\/$/, '')}/signin?callbackUrl=${encodeURIComponent(referer)}`;
      return NextResponse.redirect(loginAbs, { status: 302 });
    }

    const baseCdn = PUBLIC_CDN.replace(/\/$/, '');

    // Choose file based on entitlement and availability in R2
    const allowFullAccess = entitled || trainingAccess === 'free';

    if (allowFullAccess) {
      // Prefer HLS if present; fallback to MP4
      try {
        await r2StorageService.getAsset(`videos/${id}/master.m3u8`);
        return NextResponse.redirect(`${baseCdn}/videos/${id}/master.m3u8`, { status: 302 });
      } catch {
        return NextResponse.redirect(`${baseCdn}/videos/${id}/full.mp4`, { status: 302 });
      }
    } else {
      // Not entitled: serve preview manifest if present, fallback to MP4
      try {
        await r2StorageService.getAsset(`videos/${id}/preview.m3u8`);
        return NextResponse.redirect(`${baseCdn}/videos/${id}/preview.m3u8`, { status: 302 });
      } catch {
        // ignore and fall through
      }

      try {
        await r2StorageService.getAsset(`videos/${id}/preview.mp4`);
        return NextResponse.redirect(`${baseCdn}/videos/${id}/preview.mp4`, { status: 302 });
      } catch {
        return NextResponse.redirect(`${baseCdn}/videos/${id}/full.mp4`, { status: 302 });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve manifest', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
