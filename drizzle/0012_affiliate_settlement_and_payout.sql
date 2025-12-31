ALTER TABLE "affiliate_program" ADD COLUMN IF NOT EXISTS "settlement_delay_days" integer NOT NULL DEFAULT 7;
ALTER TABLE "affiliate_program" ADD COLUMN IF NOT EXISTS "negative_balance_limit_cents" integer NOT NULL DEFAULT 10000;

ALTER TABLE "affiliate_payout" ADD COLUMN IF NOT EXISTS "evidence_url" text;
ALTER TABLE "affiliate_payout" ADD COLUMN IF NOT EXISTS "external_reference" text;
ALTER TABLE "affiliate_payout" ADD COLUMN IF NOT EXISTS "paid_at" timestamp;
ALTER TABLE "affiliate_payout" ADD COLUMN IF NOT EXISTS "metadata" jsonb;

UPDATE "affiliate_program"
SET
	"settlement_delay_days" = COALESCE("settlement_delay_days", 7),
	"negative_balance_limit_cents" = COALESCE("negative_balance_limit_cents", 10000)
WHERE "id" = 'default';

