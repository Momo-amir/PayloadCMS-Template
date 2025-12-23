import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_carousel_block_cards" DROP COLUMN "card_background_color";
  ALTER TABLE "pages_blocks_card_carousel_block" DROP COLUMN "color_mode";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" DROP COLUMN "card_background_color";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" DROP COLUMN "color_mode";
  DROP TYPE "public"."enum_pages_blocks_card_carousel_block_color_mode";
  DROP TYPE "public"."enum__pages_v_blocks_card_carousel_block_color_mode";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_card_carousel_block_color_mode" AS ENUM('block', 'per-card');
  CREATE TYPE "public"."enum__pages_v_blocks_card_carousel_block_color_mode" AS ENUM('block', 'per-card');
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ADD COLUMN "card_background_color" "bg" DEFAULT '';
  ALTER TABLE "pages_blocks_card_carousel_block" ADD COLUMN "color_mode" "enum_pages_blocks_card_carousel_block_color_mode" DEFAULT 'block';
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ADD COLUMN "card_background_color" "bg" DEFAULT '';
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD COLUMN "color_mode" "enum__pages_v_blocks_card_carousel_block_color_mode" DEFAULT 'block';`)
}
