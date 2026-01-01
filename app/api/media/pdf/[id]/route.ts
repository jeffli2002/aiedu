import { auth } from '@/lib/auth/auth';
import { isEntitledForPremium } from '@/lib/access/entitlement';
import { NextResponse } from 'next/server';
import { r2StorageService } from '@/lib/storage/r2';
import { Readable } from 'node:stream';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// R2 public CDN base
const PUBLIC_CDN = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
    }

    if (!PUBLIC_CDN) {
      return NextResponse.json({ error: 'R2_PUBLIC_URL not configured' }, { status: 500 });
    }

    const url0 = new URL(request.url);
    const isThumb = url0.searchParams.get('thumb') === '1' || url0.searchParams.get('thumb') === 'true';

    // Public thumbnail (no auth required) - return early; try jpg then png
    if (isThumb) {
      const baseKey = `docs/${id}`;
      let key = `${baseKey}/thumb.jpg`;
      let asset;
      try {
        asset = await r2StorageService.getAsset(key);
      } catch {
        key = `${baseKey}/thumb.png`;
        asset = await r2StorageService.getAsset(key);
      }
      const { body, contentType } = asset;
      const stream = (body as any)?.pipe ? Readable.toWeb(body as any) : (body as ReadableStream<Uint8Array>);
      return new Response(stream as any, {
        status: 200,
        headers: {
          'Content-Type': contentType || (key.endsWith('.png') ? 'image/png' : 'image/jpeg'),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Security-Policy': "frame-ancestors 'self' https://www.futurai.org https://futurai.org http://localhost:3003",
        },
      });
    }

    const url = url0;
    const authOnly = url.searchParams.get('authOnly') === '1' || url.searchParams.get('authOnly') === 'true';

    const session = await auth.api.getSession({ headers: request.headers });
    const isAuthed = Boolean(session?.user?.id);
    let entitled = false;
    if (authOnly) {
      entitled = isAuthed;
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

    // Same-origin stream to avoid Chrome blocking cross-origin PDF in iframes
    // and to control headers (inline display, framing allowed).
    const baseKey = `docs/${id}`;

    // Documents
    // - docs/<id>/full.pdf
    // - docs/<id>/preview.pdf (first 10% pages)
    const target = entitled ? 'full.pdf' : 'preview.pdf';
    const key = `${baseKey}/${target}`;
    const { body, contentType } = await r2StorageService.getAsset(key);
    const stream = (body as any)?.pipe ? Readable.toWeb(body as any) : (body as ReadableStream<Uint8Array>);
    return new Response(stream as any, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'application/pdf',
        'Content-Disposition': 'inline; filename="document.pdf"',
        // Reasonable cache for PDFs; adjust as needed
        'Cache-Control': entitled ? 'private, max-age=0, no-store' : 'public, max-age=600',
        // Allow framing on our origins; omit X-Frame-Options entirely
        'Content-Security-Policy': "frame-ancestors 'self' https://www.futurai.org https://futurai.org http://localhost:3003",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve document', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
