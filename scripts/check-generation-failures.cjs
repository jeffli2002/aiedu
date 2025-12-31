// CommonJS script to avoid ESM/ts-node/esbuild issues
// Usage: node scripts/check-generation-failures.cjs <email1> <email2> ...

const envFile = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envFile });

async function main() {
  const emails = process.argv.slice(2).map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (emails.length === 0) {
    console.error('Usage: node scripts/check-generation-failures.cjs <email1> <email2> ...');
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error(`DATABASE_URL is not set. Checked env file: ${envFile}`);
    process.exit(1);
  }

  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(dbUrl);

  for (const email of emails) {
    console.log('---');
    console.log(`Email: ${email}`);

    const users = await sql`select id, name, email from "user" where lower(email) = ${email}`;
    if (users.length === 0) {
      console.log('Note: user not found');
      continue;
    }

    const u = users[0];
    console.log(`User ID: ${u.id}${u.name ? ` (${u.name})` : ''}`);

    const assetFailed = await sql`select cast(count(*) as int) as count from generated_asset where user_id = ${u.id} and status = 'failed'`;
    const batchFailed = await sql`select cast(count(*) as int) as count from batch_generation_job where user_id = ${u.id} and status = 'failed'`;

    console.log(`Failed assets: ${assetFailed[0]?.count ?? 0}`);
    console.log(`Failed batch jobs: ${batchFailed[0]?.count ?? 0}`);

    const latest = await sql`
      select id, created_at, error_message
      from generated_asset
      where user_id = ${u.id} and status = 'failed'
      order by created_at desc
      limit 3
    `;
    if (latest.length) {
      console.log('Latest failed assets:');
      for (const row of latest) {
        console.log(`  - ${row.id} | ${row.created_at ?? 'n/a'} | ${row.error_message ?? ''}`);
      }
    }
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
