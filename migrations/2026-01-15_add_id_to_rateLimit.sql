-- Migration: Add id field to rateLimit table
-- Date: 2026-01-15
-- Issue: Better Auth requires id field as primary key in rateLimit table

-- Step 1: Add id column (not null, but we'll populate it first)
ALTER TABLE "rateLimit"
ADD COLUMN "id" TEXT;

-- Step 2: Populate id with unique values (using key as basis)
UPDATE "rateLimit"
SET "id" = 'rl_' || "key" || '_' || floor(random() * 1000000)::text;

-- Step 3: Make id NOT NULL
ALTER TABLE "rateLimit"
ALTER COLUMN "id" SET NOT NULL;

-- Step 4: Drop the old primary key constraint on 'key'
ALTER TABLE "rateLimit"
DROP CONSTRAINT IF EXISTS "rateLimit_pkey";

-- Step 5: Add primary key constraint on 'id'
ALTER TABLE "rateLimit"
ADD CONSTRAINT "rateLimit_pkey" PRIMARY KEY ("id");

-- Step 6: Add index on 'key' for lookups (since it was the old primary key)
CREATE INDEX IF NOT EXISTS "rateLimit_key_idx" ON "rateLimit" ("key");
