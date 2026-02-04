import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_carousel_block" ADD COLUMN "intro_content" jsonb;
  ALTER TABLE "pages_blocks_card_block" ADD COLUMN "intro_content" jsonb;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD COLUMN "intro_content" jsonb;
  ALTER TABLE "_pages_v_blocks_card_block" ADD COLUMN "intro_content" jsonb;
  ALTER TABLE "pages_blocks_card_carousel_block" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_card_carousel_block" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_card_block" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_card_block" DROP COLUMN "heading";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_carousel_block" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_card_carousel_block" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_card_block" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_card_block" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_card_carousel_block" DROP COLUMN "intro_content";
  ALTER TABLE "pages_blocks_card_block" DROP COLUMN "intro_content";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" DROP COLUMN "intro_content";
  ALTER TABLE "_pages_v_blocks_card_block" DROP COLUMN "intro_content";`)
}
