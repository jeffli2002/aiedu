CREATE TABLE IF NOT EXISTS "affiliate_application" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE cascade,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "company_name" text,
  "company_description" text,
  "channels" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "address" text,
  "city" text,
  "country" text,
  "zip_code" text,
  "region" text,
  "payout_method" text,
  "payout_account" text,
  "status" text NOT NULL DEFAULT 'submitted',
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);
