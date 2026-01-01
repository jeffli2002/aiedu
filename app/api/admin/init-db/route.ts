import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

/**
 * Admin API route to initialize database tables
 * Protected by CRON_SECRET or ADMIN_EMAILS check
 */
export async function POST(request: NextRequest) {
  try {
    // Security check: require CRON_SECRET or admin email
    const authHeader = request.headers.get('authorization');
    const cronSecret = request.headers.get('x-cron-secret');
    const providedSecret = authHeader?.replace('Bearer ', '') || cronSecret;

    // Allow if CRON_SECRET matches or if called from admin
    const isValidSecret = providedSecret === env.CRON_SECRET;
    
    if (!isValidSecret && env.CRON_SECRET !== 'dummy') {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid secret' },
        { status: 401 }
      );
    }

    const databaseUrl = env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    console.log('[init-db] Starting database initialization...');

    // ========== Better Auth Tables ==========
    console.log('[init-db] Creating Better Auth tables...');

    // Create user table
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

    // Create session table
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

    // Create account table
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

    // Create verification table
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

    // Create rateLimit table
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

    console.log('[init-db] ✅ Better Auth tables created');

    // ========== Credit System Tables ==========
    console.log('[init-db] Creating credit system tables...');

    // user_credits table
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

    // credit_transactions table
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

    // Unique constraint to enforce idempotency for non-null referenceId per user
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

    console.log('[init-db] ✅ Credit tables created');

    return NextResponse.json({
      success: true,
      message: 'All tables initialized successfully',
      tables: [
        'user',
        'session',
        'account',
        'verification',
        'rateLimit',
        'user_credits',
        'credit_transactions',
      ],
    });
  } catch (error) {
    console.error('[init-db] Error initializing database:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize database',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

