import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env.local if present (local/dev convenience)
// In production, DATABASE_URL should be set as environment variable
config({ path: resolve(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required. Please set it or create .env.local');
  process.exit(1);
}

async function createAllTables() {
  const sql = neon(databaseUrl);

  try {
    console.log('Creating all required tables...\n');

    // ========== Better Auth Tables ==========
    console.log('Creating Better Auth tables...\n');

    // Create user table
    console.log('Creating user table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "email_verified" boolean DEFAULT false NOT NULL,
        "image" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "role" text,
        "banned" boolean,
        "ban_reason" text,
        "ban_expires" timestamp
      );
    `;
    console.log('✅ user table created');

    // Create session table
    console.log('Creating session table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" text PRIMARY KEY NOT NULL,
        "expires_at" timestamp NOT NULL,
        "token" text NOT NULL UNIQUE,
        "created_at" timestamp NOT NULL,
        "updated_at" timestamp NOT NULL,
        "ip_address" text,
        "user_agent" text,
        "user_id" text NOT NULL,
        "impersonated_by" text,
        CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ session table created');

    // Create account table
    console.log('Creating account table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" text PRIMARY KEY NOT NULL,
        "account_id" text NOT NULL,
        "provider_id" text NOT NULL,
        "user_id" text NOT NULL,
        "access_token" text,
        "refresh_token" text,
        "id_token" text,
        "access_token_expires_at" timestamp,
        "refresh_token_expires_at" timestamp,
        "scope" text,
        "password" text,
        "created_at" timestamp NOT NULL,
        "updated_at" timestamp NOT NULL,
        CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ account table created');

    // Create verification table
    console.log('Creating verification table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text PRIMARY KEY NOT NULL,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;
    console.log('✅ verification table created');

    // Create rateLimit table
    console.log('Creating rateLimit table...');
    await sql`
      DROP TABLE IF EXISTS "rateLimit";
    `;
    await sql`
      CREATE TABLE "rateLimit" (
        "id" text PRIMARY KEY NOT NULL,
        "key" text NOT NULL,
        "count" integer NOT NULL,
        "last_request" bigint NOT NULL
      );
    `;
    console.log('✅ rateLimit table created');

    console.log('\n✅ All Better Auth tables created successfully!\n');

    // ========== Credit System Tables ==========
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

    console.log('\n🎉 All tables created/verified successfully!');
    
    // ========== Quota Usage Tables ==========
    console.log('\nCreating quota usage tables...\n');

    // user_quota_usage table
    console.log('Creating user_quota_usage table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "user_quota_usage" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "service" text NOT NULL,
        "period" text NOT NULL,
        "used_amount" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "user_quota_usage_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ user_quota_usage table ready');

    // Composite unique index for (user_id, service, period)
    console.log('Ensuring unique (user_id, service, period) on user_quota_usage...');
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'user_service_period_idx'
        ) THEN
          CREATE UNIQUE INDEX user_service_period_idx
            ON user_quota_usage (user_id, service, period);
        END IF;
      END $$;
    `;
    console.log('✅ Unique index ensured for user_quota_usage');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

createAllTables()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

