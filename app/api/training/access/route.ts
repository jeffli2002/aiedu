import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getTrainingVideoCourseCreditCost } from '@/config/training.config';
import { ensureTrainingCourseAccess, hasTrainingCourseUnlock } from '@/lib/training-access';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const courseId = url.searchParams.get('courseId')?.trim();
  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
  }

  const cost = getTrainingVideoCourseCreditCost(courseId);
  const unlocked = cost <= 0 ? true : await hasTrainingCourseUnlock(session.user.id, courseId);

  return NextResponse.json({
    data: {
      courseId,
      cost,
      unlocked,
    },
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: { courseId?: string } | null = null;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const rawCourseId = payload?.courseId;
  const courseId = typeof rawCourseId === 'string' ? rawCourseId.trim() : '';
  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
  }

  const result = await ensureTrainingCourseAccess(session.user.id, courseId);

  return NextResponse.json({
    data: result,
  });
}
