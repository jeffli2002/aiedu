import { auth } from '@/lib/auth/auth';
import { isEntitledForPremium } from '@/lib/access/entitlement';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// R2 public CDN base
const PUBLIC_CDN = process.env.R2_PUBLIC_URL || '';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
    }

    if (!PUBLIC_CDN) {
      return NextResponse.json({ error: 'R2_PUBLIC_URL not configured' }, { status: 500 });
    }

    const session = await auth.api.getSession();
    const entitled = session?.user?.id
      ? await isEntitledForPremium(session.user.id, session.user.email)
      : false;

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

