import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_embed_block_embed_type" AS ENUM('html');
  CREATE TYPE "public"."enum_pages_blocks_embed_block_max_width" AS ENUM('contained', 'full');
  CREATE TYPE "public"."enum_mediaGallery_layout" AS ENUM('masonry', 'bento');
  CREATE TYPE "public"."enum_priceCards_tiers_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_embed_block_embed_type" AS ENUM('html');
  CREATE TYPE "public"."enum__pages_v_blocks_embed_block_max_width" AS ENUM('contained', 'full');
  CREATE TYPE "public"."enum__mediaGallery_v_layout" AS ENUM('masonry', 'bento');
  CREATE TYPE "public"."enum__priceCards_v_tiers_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_blocks_user_login_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_account_details_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_embed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"embed_type" "enum_pages_blocks_embed_block_embed_type" DEFAULT 'html',
  	"html" varchar,
  	"max_width" "enum_pages_blocks_embed_block_max_width" DEFAULT 'contained',
  	"block_name" varchar
  );
  
  CREATE TABLE "mediaGallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "mediaGallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"layout" "enum_mediaGallery_layout" DEFAULT 'masonry',
  	"block_name" varchar
  );
  
  CREATE TABLE "priceCards_tiers_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "priceCards_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subheading" varchar,
  	"description" varchar,
  	"link_type" "enum_priceCards_tiers_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"highlighted" boolean DEFAULT false
  );
  
  CREATE TABLE "priceCards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_user_login_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_account_details_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_embed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"embed_type" "enum__pages_v_blocks_embed_block_embed_type" DEFAULT 'html',
  	"html" varchar,
  	"max_width" "enum__pages_v_blocks_embed_block_max_width" DEFAULT 'contained',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_mediaGallery_v_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_mediaGallery_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"layout" "enum__mediaGallery_v_layout" DEFAULT 'masonry',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_priceCards_v_tiers_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_priceCards_v_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subheading" varchar,
  	"description" varchar,
  	"link_type" "enum__priceCards_v_tiers_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"highlighted" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_priceCards_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_user_login_block_2" ADD CONSTRAINT "pages_blocks_user_login_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_account_details_block_2" ADD CONSTRAINT "pages_blocks_account_details_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_embed_block" ADD CONSTRAINT "pages_blocks_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mediaGallery_images" ADD CONSTRAINT "mediaGallery_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mediaGallery_images" ADD CONSTRAINT "mediaGallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mediaGallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mediaGallery" ADD CONSTRAINT "mediaGallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "priceCards_tiers_bullets" ADD CONSTRAINT "priceCards_tiers_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."priceCards_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "priceCards_tiers" ADD CONSTRAINT "priceCards_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."priceCards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "priceCards" ADD CONSTRAINT "priceCards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_user_login_block_2" ADD CONSTRAINT "_pages_v_blocks_user_login_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_account_details_block_2" ADD CONSTRAINT "_pages_v_blocks_account_details_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_embed_block" ADD CONSTRAINT "_pages_v_blocks_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_mediaGallery_v_images" ADD CONSTRAINT "_mediaGallery_v_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_mediaGallery_v_images" ADD CONSTRAINT "_mediaGallery_v_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_mediaGallery_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_mediaGallery_v" ADD CONSTRAINT "_mediaGallery_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_priceCards_v_tiers_bullets" ADD CONSTRAINT "_priceCards_v_tiers_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_priceCards_v_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_priceCards_v_tiers" ADD CONSTRAINT "_priceCards_v_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_priceCards_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_priceCards_v" ADD CONSTRAINT "_priceCards_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_user_login_block_2_order_idx" ON "pages_blocks_user_login_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_user_login_block_2_parent_id_idx" ON "pages_blocks_user_login_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_user_login_block_2_path_idx" ON "pages_blocks_user_login_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_user_login_block_2_locale_idx" ON "pages_blocks_user_login_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_account_details_block_2_order_idx" ON "pages_blocks_account_details_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_account_details_block_2_parent_id_idx" ON "pages_blocks_account_details_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_account_details_block_2_path_idx" ON "pages_blocks_account_details_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_account_details_block_2_locale_idx" ON "pages_blocks_account_details_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_embed_block_order_idx" ON "pages_blocks_embed_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_embed_block_parent_id_idx" ON "pages_blocks_embed_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_embed_block_path_idx" ON "pages_blocks_embed_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_embed_block_locale_idx" ON "pages_blocks_embed_block" USING btree ("_locale");
  CREATE INDEX "mediaGallery_images_order_idx" ON "mediaGallery_images" USING btree ("_order");
  CREATE INDEX "mediaGallery_images_parent_id_idx" ON "mediaGallery_images" USING btree ("_parent_id");
  CREATE INDEX "mediaGallery_images_locale_idx" ON "mediaGallery_images" USING btree ("_locale");
  CREATE INDEX "mediaGallery_images_media_idx" ON "mediaGallery_images" USING btree ("media_id");
  CREATE INDEX "mediaGallery_order_idx" ON "mediaGallery" USING btree ("_order");
  CREATE INDEX "mediaGallery_parent_id_idx" ON "mediaGallery" USING btree ("_parent_id");
  CREATE INDEX "mediaGallery_path_idx" ON "mediaGallery" USING btree ("_path");
  CREATE INDEX "mediaGallery_locale_idx" ON "mediaGallery" USING btree ("_locale");
  CREATE INDEX "priceCards_tiers_bullets_order_idx" ON "priceCards_tiers_bullets" USING btree ("_order");
  CREATE INDEX "priceCards_tiers_bullets_parent_id_idx" ON "priceCards_tiers_bullets" USING btree ("_parent_id");
  CREATE INDEX "priceCards_tiers_bullets_locale_idx" ON "priceCards_tiers_bullets" USING btree ("_locale");
  CREATE INDEX "priceCards_tiers_order_idx" ON "priceCards_tiers" USING btree ("_order");
  CREATE INDEX "priceCards_tiers_parent_id_idx" ON "priceCards_tiers" USING btree ("_parent_id");
  CREATE INDEX "priceCards_tiers_locale_idx" ON "priceCards_tiers" USING btree ("_locale");
  CREATE INDEX "priceCards_order_idx" ON "priceCards" USING btree ("_order");
  CREATE INDEX "priceCards_parent_id_idx" ON "priceCards" USING btree ("_parent_id");
  CREATE INDEX "priceCards_path_idx" ON "priceCards" USING btree ("_path");
  CREATE INDEX "priceCards_locale_idx" ON "priceCards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_order_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_parent_id_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_path_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_locale_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_order_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_parent_id_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_path_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_locale_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_embed_block_order_idx" ON "_pages_v_blocks_embed_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_embed_block_parent_id_idx" ON "_pages_v_blocks_embed_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_embed_block_path_idx" ON "_pages_v_blocks_embed_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_embed_block_locale_idx" ON "_pages_v_blocks_embed_block" USING btree ("_locale");
  CREATE INDEX "_mediaGallery_v_images_order_idx" ON "_mediaGallery_v_images" USING btree ("_order");
  CREATE INDEX "_mediaGallery_v_images_parent_id_idx" ON "_mediaGallery_v_images" USING btree ("_parent_id");
  CREATE INDEX "_mediaGallery_v_images_locale_idx" ON "_mediaGallery_v_images" USING btree ("_locale");
  CREATE INDEX "_mediaGallery_v_images_media_idx" ON "_mediaGallery_v_images" USING btree ("media_id");
  CREATE INDEX "_mediaGallery_v_order_idx" ON "_mediaGallery_v" USING btree ("_order");
  CREATE INDEX "_mediaGallery_v_parent_id_idx" ON "_mediaGallery_v" USING btree ("_parent_id");
  CREATE INDEX "_mediaGallery_v_path_idx" ON "_mediaGallery_v" USING btree ("_path");
  CREATE INDEX "_mediaGallery_v_locale_idx" ON "_mediaGallery_v" USING btree ("_locale");
  CREATE INDEX "_priceCards_v_tiers_bullets_order_idx" ON "_priceCards_v_tiers_bullets" USING btree ("_order");
  CREATE INDEX "_priceCards_v_tiers_bullets_parent_id_idx" ON "_priceCards_v_tiers_bullets" USING btree ("_parent_id");
  CREATE INDEX "_priceCards_v_tiers_bullets_locale_idx" ON "_priceCards_v_tiers_bullets" USING btree ("_locale");
  CREATE INDEX "_priceCards_v_tiers_order_idx" ON "_priceCards_v_tiers" USING btree ("_order");
  CREATE INDEX "_priceCards_v_tiers_parent_id_idx" ON "_priceCards_v_tiers" USING btree ("_parent_id");
  CREATE INDEX "_priceCards_v_tiers_locale_idx" ON "_priceCards_v_tiers" USING btree ("_locale");
  CREATE INDEX "_priceCards_v_order_idx" ON "_priceCards_v" USING btree ("_order");
  CREATE INDEX "_priceCards_v_parent_id_idx" ON "_priceCards_v" USING btree ("_parent_id");
  CREATE INDEX "_priceCards_v_path_idx" ON "_priceCards_v" USING btree ("_path");
  CREATE INDEX "_priceCards_v_locale_idx" ON "_priceCards_v" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_user_login_block_2" CASCADE;
  DROP TABLE "pages_blocks_account_details_block_2" CASCADE;
  DROP TABLE "pages_blocks_embed_block" CASCADE;
  DROP TABLE "mediaGallery_images" CASCADE;
  DROP TABLE "mediaGallery" CASCADE;
  DROP TABLE "priceCards_tiers_bullets" CASCADE;
  DROP TABLE "priceCards_tiers" CASCADE;
  DROP TABLE "priceCards" CASCADE;
  DROP TABLE "_pages_v_blocks_user_login_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_account_details_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_embed_block" CASCADE;
  DROP TABLE "_mediaGallery_v_images" CASCADE;
  DROP TABLE "_mediaGallery_v" CASCADE;
  DROP TABLE "_priceCards_v_tiers_bullets" CASCADE;
  DROP TABLE "_priceCards_v_tiers" CASCADE;
  DROP TABLE "_priceCards_v" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_embed_block_embed_type";
  DROP TYPE "public"."enum_pages_blocks_embed_block_max_width";
  DROP TYPE "public"."enum_mediaGallery_layout";
  DROP TYPE "public"."enum_priceCards_tiers_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_embed_block_embed_type";
  DROP TYPE "public"."enum__pages_v_blocks_embed_block_max_width";
  DROP TYPE "public"."enum__mediaGallery_v_layout";
  DROP TYPE "public"."enum__priceCards_v_tiers_link_type";`)
}
