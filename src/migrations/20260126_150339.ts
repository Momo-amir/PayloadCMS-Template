import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "consent_tokens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"token" varchar NOT NULL,
  	"analytics" boolean DEFAULT false NOT NULL,
  	"version" numeric DEFAULT 1 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics_aggregates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_name" varchar NOT NULL,
  	"page_path" varchar,
  	"count" numeric DEFAULT 0 NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"country" varchar,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"store_aggregates" boolean DEFAULT true,
  	"anonymize_ip" boolean DEFAULT true,
  	"matomo_enabled" boolean DEFAULT false,
  	"ga4_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consent_tokens_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "analytics_aggregates_id" integer;
  CREATE UNIQUE INDEX "consent_tokens_token_idx" ON "consent_tokens" USING btree ("token");
  CREATE INDEX "consent_tokens_updated_at_idx" ON "consent_tokens" USING btree ("updated_at");
  CREATE INDEX "consent_tokens_created_at_idx" ON "consent_tokens" USING btree ("created_at");
  CREATE INDEX "analytics_aggregates_event_name_idx" ON "analytics_aggregates" USING btree ("event_name");
  CREATE INDEX "analytics_aggregates_page_path_idx" ON "analytics_aggregates" USING btree ("page_path");
  CREATE INDEX "analytics_aggregates_date_idx" ON "analytics_aggregates" USING btree ("date");
  CREATE INDEX "analytics_aggregates_country_idx" ON "analytics_aggregates" USING btree ("country");
  CREATE INDEX "analytics_aggregates_updated_at_idx" ON "analytics_aggregates" USING btree ("updated_at");
  CREATE INDEX "analytics_aggregates_created_at_idx" ON "analytics_aggregates" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_tokens_fk" FOREIGN KEY ("consent_tokens_id") REFERENCES "public"."consent_tokens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_aggregates_fk" FOREIGN KEY ("analytics_aggregates_id") REFERENCES "public"."analytics_aggregates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_consent_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("consent_tokens_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_aggregates_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_aggregates_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "consent_tokens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_aggregates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_config" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "consent_tokens" CASCADE;
  DROP TABLE "analytics_aggregates" CASCADE;
  DROP TABLE "analytics_config" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consent_tokens_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_analytics_aggregates_fk";
  
  DROP INDEX "payload_locked_documents_rels_consent_tokens_id_idx";
  DROP INDEX "payload_locked_documents_rels_analytics_aggregates_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consent_tokens_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "analytics_aggregates_id";`)
}
