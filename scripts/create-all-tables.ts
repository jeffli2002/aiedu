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

    // credit_pack_purchase table
    console.log('Creating credit_pack_purchase table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "credit_pack_purchase" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "affiliate_id" text,
        "affiliate_code" text,
        "credit_pack_id" text NOT NULL,
        "credits" integer NOT NULL,
        "amount_cents" integer NOT NULL,
        "currency" text NOT NULL DEFAULT 'USD',
        "provider" text NOT NULL DEFAULT 'creem',
        "order_id" text,
        "checkout_id" text,
        "credit_transaction_id" text,
        "metadata" jsonb,
        "test_mode" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "credit_pack_purchase_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade,
        CONSTRAINT "credit_pack_purchase_credit_transaction_id_credit_transactions_id_fk"
          FOREIGN KEY ("credit_transaction_id") REFERENCES "credit_transactions"("id") ON DELETE set null
      );
    `;
    console.log('✅ credit_pack_purchase table ready');

    // payment table
    console.log('Creating payment table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "payment" (
        "id" text PRIMARY KEY NOT NULL,
        "provider" text NOT NULL DEFAULT 'creem',
        "price_id" text NOT NULL,
        "product_id" text,
        "type" text NOT NULL,
        "interval" text,
        "user_id" text NOT NULL,
        "customer_id" text NOT NULL,
        "subscription_id" text,
        "status" text NOT NULL,
        "period_start" timestamp,
        "period_end" timestamp,
        "cancel_at_period_end" boolean,
        "trial_start" timestamp,
        "trial_end" timestamp,
        "scheduled_plan_id" text,
        "scheduled_interval" text,
        "scheduled_period_start" timestamp,
        "scheduled_period_end" timestamp,
        "scheduled_at" timestamp,
        "affiliate_id" text,
        "affiliate_code" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "payment_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ payment table ready');

    // payment_event table
    console.log('Creating payment_event table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "payment_event" (
        "id" text PRIMARY KEY NOT NULL,
        "payment_id" text NOT NULL,
        "event_type" text NOT NULL,
        "stripe_event_id" text UNIQUE,
        "creem_event_id" text UNIQUE,
        "event_data" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "payment_event_payment_id_payment_id_fk"
          FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE cascade
      );
    `;
    console.log('✅ payment_event table ready');

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

    // ========== Generation Tables ==========
    console.log('\nCreating generation tables...\n');

    // generation_lock table
    console.log('Creating generation_lock table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "generation_lock" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "asset_type" text NOT NULL,
        "request_id" text,
        "task_id" text,
        "metadata" jsonb,
        "expires_at" timestamp NOT NULL DEFAULT now(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "generation_lock_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ generation_lock table ready');

    // Unique index for (user_id, asset_type)
    console.log('Ensuring unique (user_id, asset_type) on generation_lock...');
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'generation_lock_user_asset_idx'
        ) THEN
          CREATE UNIQUE INDEX generation_lock_user_asset_idx
            ON generation_lock (user_id, asset_type);
        END IF;
      END $$;
    `;
    console.log('✅ Unique index ensured for generation_lock');

    // generated_asset table
    console.log('Creating generated_asset table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "generated_asset" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "asset_type" text NOT NULL,
        "generation_mode" text NOT NULL,
        "product_name" text,
        "product_description" text,
        "base_image_url" text,
        "prompt" text NOT NULL,
        "enhanced_prompt" text,
        "negative_prompt" text,
        "style_id" text,
        "style_customization" text,
        "video_style" text,
        "script" text,
        "script_audio_url" text,
        "r2_key" text NOT NULL,
        "public_url" text NOT NULL,
        "thumbnail_url" text,
        "width" integer,
        "height" integer,
        "duration" integer,
        "file_size" integer,
        "status" text NOT NULL DEFAULT 'processing',
        "error_message" text,
        "credits_spent" integer NOT NULL DEFAULT 0,
        "generation_params" jsonb,
        "metadata" jsonb,
        "expires_at" timestamp,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "generated_asset_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ generated_asset table ready');

    // ========== Subscription Tables ==========
    console.log('Creating subscription table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "subscription" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "plan_type" text NOT NULL DEFAULT 'free',
        "status" text NOT NULL DEFAULT 'active',
        "period_start" timestamp,
        "period_end" timestamp,
        "cancel_at_period_end" boolean DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "subscription_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ subscription table ready');

    // ========== Publish & Showcase Tables ==========
    console.log('Creating publish_submissions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "publish_submissions" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "asset_id" text,
        "asset_url" text NOT NULL,
        "preview_url" text,
        "asset_type" text NOT NULL DEFAULT 'image',
        "title" text,
        "prompt" text,
        "category" text,
        "status" text NOT NULL DEFAULT 'pending',
        "publish_to_landing" boolean NOT NULL DEFAULT false,
        "publish_to_showcase" boolean NOT NULL DEFAULT false,
        "tags" jsonb,
        "metadata" jsonb,
        "admin_notes" text,
        "rejection_reason" text,
        "reviewed_by" text,
        "reviewed_at" timestamp,
        "approved_at" timestamp,
        "rejected_at" timestamp,
        "landing_order" integer,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "publish_submissions_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    console.log('✅ publish_submissions table ready');

    console.log('Creating landing_showcase_entries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "landing_showcase_entries" (
        "id" text PRIMARY KEY NOT NULL,
        "image_url" text NOT NULL,
        "title" text NOT NULL,
        "subtitle" text,
        "category" text,
        "cta_url" text,
        "is_visible" boolean NOT NULL DEFAULT true,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );
    `;
    console.log('✅ landing_showcase_entries table ready');

    console.log('Creating social_shares table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "social_shares" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "asset_id" text,
        "platform" text NOT NULL,
        "share_url" text,
        "credits_earned" integer NOT NULL DEFAULT 0,
        "reference_id" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "social_shares_user_id_user_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
      );
    `;
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'social_shares_user_id_idx'
        ) THEN
          CREATE INDEX social_shares_user_id_idx
            ON social_shares (user_id);
        END IF;
      END $$;
    `;
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'social_shares_user_reference_unique'
        ) THEN
          CREATE UNIQUE INDEX social_shares_user_reference_unique
            ON social_shares (user_id, reference_id);
        END IF;
      END $$;
    `;
    console.log('✅ social_shares table ready');

    // ========== Admin Tables ==========
    console.log('Creating admins table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "admins" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text NOT NULL UNIQUE,
        "name" text,
        "password_hash" text NOT NULL,
        "role" text NOT NULL DEFAULT 'admin',
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "last_login_at" timestamp
      );
    `;
    console.log('✅ admins table ready');

    console.log('Creating cron_job_executions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "cron_job_executions" (
        "id" text PRIMARY KEY NOT NULL,
        "job_name" text NOT NULL,
        "started_at" timestamp NOT NULL DEFAULT now(),
        "completed_at" timestamp,
        "duration" integer,
        "status" text NOT NULL DEFAULT 'running',
        "results" jsonb,
        "error_message" text,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `;
    console.log('✅ cron_job_executions table ready');

    console.log('\n🎉 All tables created successfully!');
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
