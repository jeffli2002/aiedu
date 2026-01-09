import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required. Please check your .env.local file.');
  process.exit(1);
}

const emails = process.argv.slice(2);

async function checkUsers() {
  const sql = neon(databaseUrl);

  try {
    console.log(`\n🔍 Checking users...\n`);

    for (const email of emails) {
      const [user] = await sql`
        SELECT id, email, name FROM "user" WHERE email = ${email.toLowerCase()}
      `;

      if (user) {
        console.log(`   ⚠️  User still exists: ${email} (${user.name}, ID: ${user.id})`);
      } else {
        console.log(`   ✅ User not found: ${email}`);
      }
    }

    console.log(`\n✅ Check completed!`);
  } catch (error) {
    console.error('❌ Error checking users:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

checkUsers();

