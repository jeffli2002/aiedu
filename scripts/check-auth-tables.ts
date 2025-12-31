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

async function checkAuthTables() {
  const sql = neon(databaseUrl);

  const requiredTables = [
    'user',
    'session',
    'account',
    'verification',
    'rateLimit',
  ];

  console.log('Checking required Better Auth tables...\n');

  for (const tableName of requiredTables) {
    try {
      const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        );
      `;
      
      const exists = result[0]?.exists ?? false;
      
      if (exists) {
        console.log(`✅ Table "${tableName}" exists`);
      } else {
        console.error(`❌ Table "${tableName}" does NOT exist`);
      }
    } catch (error) {
      console.error(`❌ Error checking table "${tableName}":`, error);
    }
  }

  console.log('\nDone!');
}

checkAuthTables()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

