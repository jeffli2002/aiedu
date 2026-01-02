import { auth } from '@/lib/auth/auth';
import { db } from '@/server/db';
import { user as userTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If we have a session, reconcile emailVerified from DB to reflect latest verification state
    let mergedSession = session;
    if (session?.user?.id) {
      try {
        const [dbUser] = await db
          .select({ emailVerified: userTable.emailVerified })
          .from(userTable)
          .where(eq(userTable.id, session.user.id))
          .limit(1);
        if (dbUser && typeof dbUser.emailVerified !== 'undefined') {
          mergedSession = {
            ...session,
            user: {
              ...session.user,
              emailVerified: dbUser.emailVerified,
            },
          } as typeof session;
        }
      } catch (reconcileError) {
        console.warn('[get-session] Failed to reconcile emailVerified from DB:', reconcileError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        session: mergedSession,
        authenticated: Boolean(mergedSession?.user?.id),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[get-session] failed to load session', error);
    return NextResponse.json(
      {
        success: false,
        session: null,
        authenticated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}
