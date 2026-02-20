import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_archive" ADD COLUMN "enable_pagination" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_archive_2" ADD COLUMN "enable_pagination" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_archive_3" ADD COLUMN "enable_pagination" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_people_archive" ADD COLUMN "enable_pagination" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "enable_pagination" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_archive_2" ADD COLUMN "enable_pagination" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_archive_3" ADD COLUMN "enable_pagination" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_people_archive" ADD COLUMN "enable_pagination" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_archive" DROP COLUMN "enable_pagination";
  ALTER TABLE "pages_blocks_archive_2" DROP COLUMN "enable_pagination";
  ALTER TABLE "pages_blocks_archive_3" DROP COLUMN "enable_pagination";
  ALTER TABLE "pages_blocks_people_archive" DROP COLUMN "enable_pagination";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "enable_pagination";
  ALTER TABLE "_pages_v_blocks_archive_2" DROP COLUMN "enable_pagination";
  ALTER TABLE "_pages_v_blocks_archive_3" DROP COLUMN "enable_pagination";
  ALTER TABLE "_pages_v_blocks_people_archive" DROP COLUMN "enable_pagination";`)
}
