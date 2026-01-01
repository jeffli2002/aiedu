import { auth } from '@/lib/auth/auth';
import { isEntitledForPremium } from '@/lib/access/entitlement';
import { NextResponse } from 'next/server';

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
    if (url0.searchParams.get('thumb') === '1' || url0.searchParams.get('thumb') === 'true') {
      const thumb = `${PUBLIC_CDN.replace(/\/$/, '')}/docs/${id}/thumb.jpg`;
      return NextResponse.redirect(thumb, { status: 302 });
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

    // Expect paths:
    // - docs/<id>/full.pdf
    // - docs/<id>/preview.pdf (first 10% pages)
    const target = entitled ? 'full.pdf' : 'preview.pdf';
    const location = `${PUBLIC_CDN.replace(/\/$/, '')}/docs/${id}/${target}`;

    return NextResponse.redirect(location, { status: 302 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve document', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
