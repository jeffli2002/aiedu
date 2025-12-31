import { auth } from '@/lib/auth/auth';
import { db } from '@/server/db';
import { platformPublish } from '@/server/db/schema';
import { and, desc, eq, type SQL } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const platform = searchParams.get('platform');
    const limit = Number.parseInt(searchParams.get('limit') || '50');
    const offset = Number.parseInt(searchParams.get('offset') || '0');

    // Build a single where expression to satisfy Drizzle typings
    const conditions: SQL[] = [eq(platformPublish.userId, session.user.id)];

    if (assetId) {
      conditions.push(eq(platformPublish.assetId, assetId));
    }

    // Narrow platform to enum if it's a supported value
    const allowedPlatforms = ['tiktok', 'amazon', 'shopify', 'taobao', 'douyin', 'temu', 'other'] as const;
    if (platform && (allowedPlatforms as readonly string[]).includes(platform)) {
      // Cast to the table column enum type
      conditions.push(
        eq(
          platformPublish.platform,
          platform as (typeof allowedPlatforms)[number]
        )
      );
    }

    const whereExpr = conditions.length > 1 ? and(...conditions) : conditions[0];

    const records = await db
      .select()
      .from(platformPublish)
      .where(whereExpr)
      .orderBy(desc(platformPublish.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Get publish history error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get publish history',
      },
      { status: 500 }
    );
  }
}
