import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { and, eq, inArray, sql, desc } from 'drizzle-orm';
import { user, generatedAsset, batchGenerationJob } from '../server/db/schema';

type FailureSummary = {
  email: string;
  userId?: string;
  userName?: string | null;
  assetsFailed: number;
  batchJobsFailed: number;
  latestAssetFailures: Array<{ id: string; createdAt: Date | null; errorMessage: string | null }>;
  note?: string;
};

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set. Check your .env.local');
    process.exit(1);
  }

  // Emails can be passed as CLI args; fallback to none
  const emails = process.argv.slice(2).map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (emails.length === 0) {
    console.error('Usage: tsx scripts/check-generation-failures.ts <email1> <email2> ...');
    process.exit(1);
  }

  const sqlClient = neon(dbUrl);
  const db = drizzle(sqlClient);

  // Fetch users by email
  const users = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .where(inArray(user.email, emails));

  const byEmail = new Map(users.map((u) => [u.email.toLowerCase(), u]));

  const results: FailureSummary[] = [];

  for (const email of emails) {
    const u = byEmail.get(email);
    if (!u) {
      results.push({ email, assetsFailed: 0, batchJobsFailed: 0, latestAssetFailures: [], note: 'user not found' });
      continue;
    }

    // Count failed generated assets
    const assetsFailedRows = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(generatedAsset)
      .where(and(eq(generatedAsset.userId, u.id), eq(generatedAsset.status, 'failed')));
    const assetsFailed = assetsFailedRows[0]?.count ?? 0;

    // Count failed batch jobs
    const batchFailedRows = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(batchGenerationJob)
      .where(and(eq(batchGenerationJob.userId, u.id), eq(batchGenerationJob.status, 'failed')));
    const batchJobsFailed = batchFailedRows[0]?.count ?? 0;

    // Latest 3 failed assets with timestamps and error message
    const latestAssetFailures = await db
      .select({ id: generatedAsset.id, createdAt: generatedAsset.createdAt, errorMessage: generatedAsset.errorMessage })
      .from(generatedAsset)
      .where(and(eq(generatedAsset.userId, u.id), eq(generatedAsset.status, 'failed')))
      .orderBy(desc(generatedAsset.createdAt))
      .limit(3);

    results.push({
      email: u.email,
      userId: u.id,
      userName: u.name,
      assetsFailed,
      batchJobsFailed,
      latestAssetFailures,
    });
  }

  // Pretty print
  for (const r of results) {
    console.log('---');
    console.log(`Email: ${r.email}`);
    if (r.userId) console.log(`User ID: ${r.userId}${r.userName ? ` (${r.userName})` : ''}`);
    if (r.note) console.log(`Note: ${r.note}`);
    console.log(`Failed assets: ${r.assetsFailed}`);
    console.log(`Failed batch jobs: ${r.batchJobsFailed}`);
    if (r.latestAssetFailures.length > 0) {
      console.log('Latest failed assets:');
      for (const f of r.latestAssetFailures) {
        console.log(`  - ${f.id} | ${f.createdAt ?? 'n/a'} | ${f.errorMessage ?? ''}`);
      }
    }
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

