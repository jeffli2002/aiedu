import { NextResponse } from 'next/server';
import { env } from '@/env';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type TableCheck = {
  name: string;
  exists: boolean;
};

const REQUIRED_TABLES: string[] = [
  // Better Auth core tables
  'user',
  'session',
  'account',
  'verification',
  'rateLimit',
  // Credits system
  'user_credits',
  'credit_transactions',
  // Quota usage
  'user_quota_usage',
];

async function checkTables(): Promise<TableCheck[]> {
  const sql = neon(env.DATABASE_URL);
  const results: TableCheck[] = [];

  for (const tableName of REQUIRED_TABLES) {
    try {
      const rows = (await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = ${tableName}
        );
      `) as unknown as Array<{ exists: boolean }>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exists = Boolean(rows && rows[0] && (rows[0] as any).exists);
      results.push({ name: tableName, exists });
    } catch {
      results.push({ name: tableName, exists: false });
    }
  }

  return results;
}

export async function GET() {
  try {
    const tables = await checkTables();
    const missing = tables.filter((t) => !t.exists).map((t) => t.name);

    return NextResponse.json(
      {
        ok: missing.length === 0,
        tables,
        missing,
        hint:
          missing.length === 0
            ? undefined
            : 'Run pnpm tsx scripts/create-all-tables.ts (or POST /api/admin/init-db with your CRON_SECRET) to create missing tables.',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
