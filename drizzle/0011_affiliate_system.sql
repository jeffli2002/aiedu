CREATE TABLE IF NOT EXISTS "affiliate_program" (
	"id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL DEFAULT true,
	"attribution_window_days" integer NOT NULL DEFAULT 30,
	"default_commission_bps" integer NOT NULL DEFAULT 1000,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "affiliate" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE cascade,
	"code" text NOT NULL,
	"status" text NOT NULL DEFAULT 'active',
	"parent_affiliate_id" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "affiliate_code_unique" ON "affiliate" USING btree ("code");

CREATE TABLE IF NOT EXISTS "affiliate_click" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_id" text NOT NULL REFERENCES "affiliate"("id") ON DELETE cascade,
	"affiliate_code" text NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE set null,
	"path" text,
	"referrer" text,
	"ip_hash" text,
	"user_agent_hash" text,
	"created_at" timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS "affiliate_click_affiliate_id_idx" ON "affiliate_click" USING btree ("affiliate_id");

CREATE TABLE IF NOT EXISTS "affiliate_commission" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_id" text NOT NULL REFERENCES "affiliate"("id") ON DELETE cascade,
	"buyer_user_id" text REFERENCES "user"("id") ON DELETE set null,
	"source_type" text NOT NULL,
	"source_id" text,
	"provider" text NOT NULL,
	"provider_event_id" text NOT NULL,
	"currency" text NOT NULL DEFAULT 'USD',
	"base_amount_cents" integer NOT NULL,
	"commission_bps" integer NOT NULL,
	"commission_amount_cents" integer NOT NULL,
	"status" text NOT NULL DEFAULT 'available',
	"available_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "affiliate_commission_provider_event_unique" ON "affiliate_commission" USING btree ("provider","provider_event_id");
CREATE INDEX IF NOT EXISTS "affiliate_commission_affiliate_id_idx" ON "affiliate_commission" USING btree ("affiliate_id");

CREATE TABLE IF NOT EXISTS "affiliate_wallet_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_id" text NOT NULL REFERENCES "affiliate"("id") ON DELETE cascade,
	"type" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL DEFAULT 'USD',
	"reference_type" text NOT NULL,
	"reference_id" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "affiliate_wallet_reference_unique" ON "affiliate_wallet_ledger" USING btree ("affiliate_id","reference_type","reference_id");
CREATE INDEX IF NOT EXISTS "affiliate_wallet_affiliate_id_idx" ON "affiliate_wallet_ledger" USING btree ("affiliate_id");

CREATE TABLE IF NOT EXISTS "affiliate_payout" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_id" text NOT NULL REFERENCES "affiliate"("id") ON DELETE cascade,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL DEFAULT 'USD',
	"status" text NOT NULL DEFAULT 'requested',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);

ALTER TABLE "credit_pack_purchase" ADD COLUMN IF NOT EXISTS "affiliate_id" text;
ALTER TABLE "credit_pack_purchase" ADD COLUMN IF NOT EXISTS "affiliate_code" text;

ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "affiliate_id" text;
ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "affiliate_code" text;

DO $$
BEGIN
	ALTER TABLE "credit_pack_purchase"
		ADD CONSTRAINT "credit_pack_purchase_affiliate_id_affiliate_id_fk"
		FOREIGN KEY ("affiliate_id") REFERENCES "affiliate"("id") ON DELETE set null;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
	ALTER TABLE "payment"
		ADD CONSTRAINT "payment_affiliate_id_affiliate_id_fk"
		FOREIGN KEY ("affiliate_id") REFERENCES "affiliate"("id") ON DELETE set null;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO "affiliate_program" (
	"id",
	"enabled",
	"attribution_window_days",
	"default_commission_bps",
	"created_at",
	"updated_at"
)
VALUES (
	'default',
	true,
	30,
	1000,
	now(),
	now()
)
ON CONFLICT ("id") DO NOTHING;

