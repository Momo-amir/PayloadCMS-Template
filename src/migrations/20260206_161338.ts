import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_two_block_background_mode" AS ENUM('color', 'media');
  CREATE TYPE "public"."enum_pages_blocks_two_block_text_color_mode" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum_pages_blocks_card_carousel_block_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum_pages_blocks_card_block_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_two_block_background_mode" AS ENUM('color', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_two_block_text_color_mode" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum__pages_v_blocks_card_carousel_block_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_card_block_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum_forms_action" AS ENUM('none', 'newsletter');
  CREATE TABLE "pages_blocks_card_carousel_block_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "pages_blocks_card_block_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_card_carousel_block_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_block_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "centered" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_cta_2" ADD COLUMN "centered" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_two_block" ADD COLUMN "background_mode" "enum_pages_blocks_two_block_background_mode" DEFAULT 'color';
  ALTER TABLE "pages_blocks_two_block" ADD COLUMN "text_color_mode" "enum_pages_blocks_two_block_text_color_mode" DEFAULT 'white';
  ALTER TABLE "pages_blocks_card_carousel_block" ADD COLUMN "card_type" "enum_pages_blocks_card_carousel_block_card_type" DEFAULT 'link';
  ALTER TABLE "pages_blocks_card_block" ADD COLUMN "card_type" "enum_pages_blocks_card_block_card_type" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "centered" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_cta_2" ADD COLUMN "centered" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_two_block" ADD COLUMN "background_mode" "enum__pages_v_blocks_two_block_background_mode" DEFAULT 'color';
  ALTER TABLE "_pages_v_blocks_two_block" ADD COLUMN "text_color_mode" "enum__pages_v_blocks_two_block_text_color_mode" DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD COLUMN "card_type" "enum__pages_v_blocks_card_carousel_block_card_type" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_card_block" ADD COLUMN "card_type" "enum__pages_v_blocks_card_block_card_type" DEFAULT 'link';
  ALTER TABLE "forms" ADD COLUMN "action" "enum_forms_action" DEFAULT 'none';
  ALTER TABLE "form_submissions" ADD COLUMN "action" varchar;
  ALTER TABLE "pages_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "pages_blocks_card_carousel_block_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "pages_blocks_card_carousel_block_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_block_info_cards" ADD CONSTRAINT "pages_blocks_card_block_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_block_info_cards" ADD CONSTRAINT "pages_blocks_card_block_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "_pages_v_blocks_card_carousel_block_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "_pages_v_blocks_card_carousel_block_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_block_info_cards" ADD CONSTRAINT "_pages_v_blocks_card_block_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_block_info_cards" ADD CONSTRAINT "_pages_v_blocks_card_block_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_order_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_parent_id_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_locale_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_media_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("media_id");
  CREATE INDEX "pages_blocks_card_block_info_cards_order_idx" ON "pages_blocks_card_block_info_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_block_info_cards_parent_id_idx" ON "pages_blocks_card_block_info_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_block_info_cards_locale_idx" ON "pages_blocks_card_block_info_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_block_info_cards_media_idx" ON "pages_blocks_card_block_info_cards" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_order_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_parent_id_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_locale_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_media_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_card_block_info_cards_order_idx" ON "_pages_v_blocks_card_block_info_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_block_info_cards_parent_id_idx" ON "_pages_v_blocks_card_block_info_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_block_info_cards_locale_idx" ON "_pages_v_blocks_card_block_info_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_block_info_cards_media_idx" ON "_pages_v_blocks_card_block_info_cards" USING btree ("media_id");
  ALTER TABLE "pages_blocks_two_block" DROP COLUMN "theme_mode";
  ALTER TABLE "_pages_v_blocks_two_block" DROP COLUMN "theme_mode";
  DROP TYPE "public"."enum_pages_blocks_two_block_theme_mode";
  DROP TYPE "public"."enum__pages_v_blocks_two_block_theme_mode";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_two_block_theme_mode" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_two_block_theme_mode" AS ENUM('light', 'dark');
  DROP TABLE "pages_blocks_card_carousel_block_info_cards" CASCADE;
  DROP TABLE "pages_blocks_card_block_info_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_carousel_block_info_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_block_info_cards" CASCADE;
  ALTER TABLE "pages_blocks_two_block" ADD COLUMN "theme_mode" "enum_pages_blocks_two_block_theme_mode" DEFAULT 'light';
  ALTER TABLE "_pages_v_blocks_two_block" ADD COLUMN "theme_mode" "enum__pages_v_blocks_two_block_theme_mode" DEFAULT 'light';
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "centered";
  ALTER TABLE "pages_blocks_cta_2" DROP COLUMN "centered";
  ALTER TABLE "pages_blocks_two_block" DROP COLUMN "background_mode";
  ALTER TABLE "pages_blocks_two_block" DROP COLUMN "text_color_mode";
  ALTER TABLE "pages_blocks_card_carousel_block" DROP COLUMN "card_type";
  ALTER TABLE "pages_blocks_card_block" DROP COLUMN "card_type";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "centered";
  ALTER TABLE "_pages_v_blocks_cta_2" DROP COLUMN "centered";
  ALTER TABLE "_pages_v_blocks_two_block" DROP COLUMN "background_mode";
  ALTER TABLE "_pages_v_blocks_two_block" DROP COLUMN "text_color_mode";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" DROP COLUMN "card_type";
  ALTER TABLE "_pages_v_blocks_card_block" DROP COLUMN "card_type";
  ALTER TABLE "forms" DROP COLUMN "action";
  ALTER TABLE "form_submissions" DROP COLUMN "action";
  DROP TYPE "public"."enum_pages_blocks_two_block_background_mode";
  DROP TYPE "public"."enum_pages_blocks_two_block_text_color_mode";
  DROP TYPE "public"."enum_pages_blocks_card_carousel_block_card_type";
  DROP TYPE "public"."enum_pages_blocks_card_block_card_type";
  DROP TYPE "public"."enum__pages_v_blocks_two_block_background_mode";
  DROP TYPE "public"."enum__pages_v_blocks_two_block_text_color_mode";
  DROP TYPE "public"."enum__pages_v_blocks_card_carousel_block_card_type";
  DROP TYPE "public"."enum__pages_v_blocks_card_block_card_type";
  DROP TYPE "public"."enum_forms_action";`)
}
