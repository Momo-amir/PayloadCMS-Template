import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."bg" ADD VALUE 'neutral';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  DROP TYPE "public"."bg";
  CREATE TYPE "public"."bg" AS ENUM('', 'dark', 'accent', 'accentThree', 'secondary');
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";`)
}
