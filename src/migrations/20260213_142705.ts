import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "sizes_2k_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_2k_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_2k_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_2k_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_2k_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_2k_filename" varchar;
  CREATE INDEX "media_sizes_2k_sizes_2k_filename_idx" ON "media" USING btree ("sizes_2k_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_sizes_2k_sizes_2k_filename_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_2k_url";
  ALTER TABLE "media" DROP COLUMN "sizes_2k_width";
  ALTER TABLE "media" DROP COLUMN "sizes_2k_height";
  ALTER TABLE "media" DROP COLUMN "sizes_2k_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_2k_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_2k_filename";`)
}
