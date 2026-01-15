import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

async function runMigration() {
  const sql = neon(DATABASE_URL);

  console.log('=== Running Migration: Add id to rateLimit table ===\n');

  try {
    // Step 1: Add id column
    console.log('Step 1: Adding id column...');
    await sql`ALTER TABLE "rateLimit" ADD COLUMN IF NOT EXISTS "id" TEXT`;

    // Step 2: Populate id with unique values
    console.log('Step 2: Populating id with unique values...');
    await sql`UPDATE "rateLimit" SET "id" = 'rl_' || "key" || '_' || floor(random() * 1000000)::text WHERE "id" IS NULL`;

    // Step 3: Make id NOT NULL
    console.log('Step 3: Making id NOT NULL...');
    await sql`ALTER TABLE "rateLimit" ALTER COLUMN "id" SET NOT NULL`;

    // Step 4: Check for existing constraints
    console.log('Step 4: Checking existing constraints...');
    const constraints = await sql`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'rateLimit'
      AND constraint_type = 'PRIMARY KEY'
    `;

    if (constraints.length > 0) {
      const constraintName = constraints[0].constraint_name;
      console.log(`   Found constraint: ${constraintName}`);
      console.log('   Dropping old primary key constraint...');
      await sql.query(`ALTER TABLE "rateLimit" DROP CONSTRAINT "${constraintName}"`);
    }

    // Step 5: Add primary key constraint on 'id'
    console.log('Step 5: Adding primary key on id...');
    await sql`ALTER TABLE "rateLimit" ADD PRIMARY KEY ("id")`;

    // Step 6: Add index on 'key'
    console.log('Step 6: Adding index on key...');
    await sql`CREATE INDEX IF NOT EXISTS "rateLimit_key_idx" ON "rateLimit" ("key")`;

    console.log('\n✅ Migration completed successfully!\n');

    // Verify the migration
    console.log('Verifying schema...');
    const schema = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'rateLimit'
      ORDER BY ordinal_position
    `;
    console.log('Current rateLimit columns:');
    schema.forEach((col) => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  }
}

runMigration();
