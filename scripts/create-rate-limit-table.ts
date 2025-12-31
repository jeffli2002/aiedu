import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required. Please check your .env.local file.');
  process.exit(1);
}

async function createRateLimitTable() {
  const sql = neon(databaseUrl);

  try {
    console.log('Creating rateLimit table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS "rateLimit" (
        "key" text PRIMARY KEY NOT NULL,
        "count" integer NOT NULL,
        "last_request" bigint NOT NULL
      );
    `;

    console.log('✅ rateLimit table created successfully!');
  } catch (error) {
    console.error('❌ Error creating rateLimit table:', error);
    throw error;
  }
}

createRateLimitTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

