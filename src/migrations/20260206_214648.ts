import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_privacy_policy" ALTER COLUMN "name" SET DEFAULT 'privacy';
  ALTER TABLE "forms_blocks_privacy_policy" ALTER COLUMN "policy_link" SET DEFAULT '/privatlivspolitik';
  ALTER TABLE "forms_blocks_privacy_policy_locales" ALTER COLUMN "label" SET DEFAULT 'Jeg accepterer behandling af mine oplysninger i overensstemmelse med';
  ALTER TABLE "forms_blocks_privacy_policy_locales" ALTER COLUMN "link_label" SET DEFAULT 'privatlivspolitik';
  ALTER TABLE "forms_blocks_privacy_policy" DROP COLUMN "default_value";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_privacy_policy" ALTER COLUMN "name" DROP DEFAULT;
  ALTER TABLE "forms_blocks_privacy_policy" ALTER COLUMN "policy_link" SET DEFAULT '/privacy-policy';
  ALTER TABLE "forms_blocks_privacy_policy_locales" ALTER COLUMN "label" SET DEFAULT 'I agree to the';
  ALTER TABLE "forms_blocks_privacy_policy_locales" ALTER COLUMN "link_label" SET DEFAULT 'privacy policy';
  ALTER TABLE "forms_blocks_privacy_policy" ADD COLUMN "default_value" boolean DEFAULT false;`)
}
