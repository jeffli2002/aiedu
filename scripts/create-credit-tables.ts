import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env.local if present (local/dev convenience)
config({ path: resolve(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required. Please set it or create .env.local');
  process.exit(1);
}

async function createCreditTables() {
  const sql = neon(databaseUrl);

  try {
    console.log('Creating credit system tables...\n');

    // user_credits table
    console.log('Creating user_credits table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "user_credits" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL UNIQUE,
        "balance" integer NOT NULL DEFAULT 0,
        "total_earned" integer NOT NULL DEFAULT 0,
        "total_spent" integer NOT NULL DEFAULT 0,
        "frozen_balance" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "user_credits_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ user_credits table ready');

    // credit_transactions table
    console.log('Creating credit_transactions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "credit_transactions" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "type" text NOT NULL,
        "amount" integer NOT NULL,
        "balance_after" integer NOT NULL,
        "source" text NOT NULL,
        "description" text,
        "reference_id" text,
        "metadata" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "credit_transactions_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ credit_transactions table ready');

    // Unique constraint to enforce idempotency for non-null referenceId per user
    console.log('Ensuring unique (user_id, reference_id) on credit_transactions...');
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'credit_user_reference_unique'
        ) THEN
          CREATE UNIQUE INDEX credit_user_reference_unique
            ON credit_transactions (user_id, reference_id)
            WHERE reference_id IS NOT NULL;
        END IF;
      END $$;
    `;
    console.log('✅ Unique index ensured');

    console.log('\n🎉 Credit tables created/verified successfully');
  } catch (error) {
    console.error('❌ Error creating credit tables:', error);
    throw error;
  }
}

createCreditTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

