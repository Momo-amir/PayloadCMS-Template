import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_media_block_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_media_type" AS ENUM('image', 'video');
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
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "media_type" "enum_pages_blocks_media_block_media_type" DEFAULT 'image';
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "autoplay" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "loop" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "muted" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "controls" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ADD COLUMN "tag" varchar;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "media_type" "enum__pages_v_blocks_media_block_media_type" DEFAULT 'image';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "autoplay" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "loop" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "muted" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "controls" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ADD COLUMN "tag" varchar;
  ALTER TABLE "pages_blocks_card_carousel_block_cards" DROP COLUMN "link_appearance";
  ALTER TABLE "pages_blocks_card_carousel_block" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" DROP COLUMN "link_appearance";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" DROP COLUMN "columns";
  DROP TYPE "public"."enum_pages_blocks_card_carousel_block_cards_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_card_carousel_block_cards_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_card_carousel_block_cards_link_appearance" AS ENUM('default', 'link', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_card_carousel_block_cards_link_appearance" AS ENUM('default', 'link', 'outline');
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::text;
  DROP TYPE "public"."bg";
  CREATE TYPE "public"."bg" AS ENUM('', 'light', 'dark', 'primary', 'secondary');
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "pages_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DEFAULT ''::"public"."bg";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."bg" USING "card_background_color"::"public"."bg";
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ADD COLUMN "link_appearance" "enum_pages_blocks_card_carousel_block_cards_link_appearance" DEFAULT 'default';
  ALTER TABLE "pages_blocks_card_carousel_block" ADD COLUMN "columns" numeric DEFAULT 3;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ADD COLUMN "link_appearance" "enum__pages_v_blocks_card_carousel_block_cards_link_appearance" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD COLUMN "columns" numeric DEFAULT 3;
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "media_type";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "autoplay";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "loop";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "muted";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "controls";
  ALTER TABLE "pages_blocks_card_carousel_block_cards" DROP COLUMN "tag";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "media_type";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "autoplay";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "loop";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "muted";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "controls";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" DROP COLUMN "tag";
  DROP TYPE "public"."enum_pages_blocks_media_block_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_media_type";`)
}
