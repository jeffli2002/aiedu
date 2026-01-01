import { auth } from '@/lib/auth/auth';
import { isEntitledForPremium } from '@/lib/access/entitlement';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Environment layout for R2 public CDN
// Example structure:
// - videos/<id>/master.m3u8
// - videos/<id>/preview.m3u8
const PUBLIC_CDN = process.env.R2_PUBLIC_URL || '';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing video id' }, { status: 400 });
    }

    if (!PUBLIC_CDN) {
      return NextResponse.json({ error: 'R2_PUBLIC_URL not configured' }, { status: 500 });
    }

    // Check session entitlement
    const session = await auth.api.getSession();
    const entitled = session?.user?.id
      ? await isEntitledForPremium(session.user.id, session.user.email)
      : false;

    const manifest = entitled ? 'master.m3u8' : 'preview.m3u8';
    const location = `${PUBLIC_CDN.replace(/\/$/, '')}/videos/${id}/${manifest}`;

    return NextResponse.redirect(location, { status: 302 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve manifest', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

