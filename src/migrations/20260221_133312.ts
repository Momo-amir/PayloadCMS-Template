import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "consent_tokens" ADD COLUMN "analytics_local_storage" boolean DEFAULT false NOT NULL;
  ALTER TABLE "consent_tokens" ADD COLUMN "analytics_third_party_sharing" boolean DEFAULT false NOT NULL;
  ALTER TABLE "consent_tokens" ADD COLUMN "marketing" boolean DEFAULT false NOT NULL;
  ALTER TABLE "consent_tokens" ADD COLUMN "personalization" boolean DEFAULT false NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "consent_tokens" DROP COLUMN "analytics_local_storage";
  ALTER TABLE "consent_tokens" DROP COLUMN "analytics_third_party_sharing";
  ALTER TABLE "consent_tokens" DROP COLUMN "marketing";
  ALTER TABLE "consent_tokens" DROP COLUMN "personalization";`)
}
