import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_accordion" ADD COLUMN "intro_content" jsonb;
  ALTER TABLE "pages_blocks_accordion" ADD COLUMN "side_by_side_with_intro" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_accordion" ADD COLUMN "intro_content" jsonb;
  ALTER TABLE "_pages_v_blocks_accordion" ADD COLUMN "side_by_side_with_intro" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_accordion" DROP COLUMN "intro_content";
  ALTER TABLE "pages_blocks_accordion" DROP COLUMN "side_by_side_with_intro";
  ALTER TABLE "_pages_v_blocks_accordion" DROP COLUMN "intro_content";
  ALTER TABLE "_pages_v_blocks_accordion" DROP COLUMN "side_by_side_with_intro";`)
}
