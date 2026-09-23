import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_archive_block_2" CASCADE;
  DROP TABLE "pages_blocks_archive_block_3" CASCADE;
  DROP TABLE "cta_2_links" CASCADE;
  DROP TABLE "cta_2" CASCADE;
  DROP TABLE "pages_blocks_form_block_2" CASCADE;
  DROP TABLE "pages_blocks_media_block_2" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block_2_links" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block_2" CASCADE;
  DROP TABLE "pages_blocks_user_login_block_2" CASCADE;
  DROP TABLE "pages_blocks_account_details_block_2" CASCADE;
  DROP TABLE "pages_blocks_embed_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_block_3" CASCADE;
  DROP TABLE "_cta_v_2_links" CASCADE;
  DROP TABLE "_cta_v_2" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block_2_links" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_user_login_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_account_details_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_embed_block_2" CASCADE;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  DROP TYPE "public"."enum_pages_blocks_archive_block_2_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_block_2_relation_to";
  DROP TYPE "public"."enum_pages_blocks_archive_block_3_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_block_3_relation_to";
  DROP TYPE "public"."enum_cta_2_links_link_type";
  DROP TYPE "public"."enum_cta_2_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_media_block_2_media_type";
  DROP TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_embed_block_2_embed_type";
  DROP TYPE "public"."enum_pages_blocks_embed_block_2_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_2_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_2_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_3_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_3_relation_to";
  DROP TYPE "public"."enum__cta_v_2_links_link_type";
  DROP TYPE "public"."enum__cta_v_2_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_2_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_embed_block_2_embed_type";
  DROP TYPE "public"."enum__pages_v_blocks_embed_block_2_max_width";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_archive_block_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_cta_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_cta_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_pages_blocks_media_block_2_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_pages_blocks_embed_block_2_embed_type" AS ENUM('html');
  CREATE TYPE "public"."enum_pages_blocks_embed_block_2_max_width" AS ENUM('contained', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__cta_v_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__cta_v_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_2_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__pages_v_blocks_embed_block_2_embed_type" AS ENUM('html');
  CREATE TYPE "public"."enum__pages_v_blocks_embed_block_2_max_width" AS ENUM('contained', 'full');
  CREATE TABLE "pages_blocks_archive_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_block_2_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_block_2_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive_block_3" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_block_3_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_block_3_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "cta_2_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_cta_2_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_cta_2_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "cta_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"centered" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"media_type" "enum_pages_blocks_media_block_2_media_type" DEFAULT 'image',
  	"autoplay" boolean DEFAULT true,
  	"loop" boolean DEFAULT true,
  	"muted" boolean DEFAULT true,
  	"controls" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_block_2_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_rich_text_block_2_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_rich_text_block_2_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_rich_text_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "pages_blocks_embed_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"embed_type" "enum_pages_blocks_embed_block_2_embed_type" DEFAULT 'html',
  	"html" varchar,
  	"max_width" "enum_pages_blocks_embed_block_2_max_width" DEFAULT 'contained',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_block_2_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_block_2_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive_block_3" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_block_3_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_block_3_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_cta_v_2_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__cta_v_2_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__cta_v_2_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cta_v_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"centered" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"media_type" "enum__pages_v_blocks_media_block_2_media_type" DEFAULT 'image',
  	"autoplay" boolean DEFAULT true,
  	"loop" boolean DEFAULT true,
  	"muted" boolean DEFAULT true,
  	"controls" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_block_2_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_rich_text_block_2_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_rich_text_block_2_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_pages_v_blocks_embed_block_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"embed_type" "enum__pages_v_blocks_embed_block_2_embed_type" DEFAULT 'html',
  	"html" varchar,
  	"max_width" "enum__pages_v_blocks_embed_block_2_max_width" DEFAULT 'contained',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_archive_block_2" ADD CONSTRAINT "pages_blocks_archive_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_block_3" ADD CONSTRAINT "pages_blocks_archive_block_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_2_links" ADD CONSTRAINT "cta_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_2" ADD CONSTRAINT "cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block_2" ADD CONSTRAINT "pages_blocks_form_block_2_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block_2" ADD CONSTRAINT "pages_blocks_form_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block_2" ADD CONSTRAINT "pages_blocks_media_block_2_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block_2" ADD CONSTRAINT "pages_blocks_media_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_block_2_links" ADD CONSTRAINT "pages_blocks_rich_text_block_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text_block_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_block_2" ADD CONSTRAINT "pages_blocks_rich_text_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_user_login_block_2" ADD CONSTRAINT "pages_blocks_user_login_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_account_details_block_2" ADD CONSTRAINT "pages_blocks_account_details_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_embed_block_2" ADD CONSTRAINT "pages_blocks_embed_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_block_2" ADD CONSTRAINT "_pages_v_blocks_archive_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_block_3" ADD CONSTRAINT "_pages_v_blocks_archive_block_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_v_2_links" ADD CONSTRAINT "_cta_v_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cta_v_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_v_2" ADD CONSTRAINT "_cta_v_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_2" ADD CONSTRAINT "_pages_v_blocks_form_block_2_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_2" ADD CONSTRAINT "_pages_v_blocks_form_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block_2" ADD CONSTRAINT "_pages_v_blocks_media_block_2_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block_2" ADD CONSTRAINT "_pages_v_blocks_media_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_block_2_links" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text_block_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_block_2" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_user_login_block_2" ADD CONSTRAINT "_pages_v_blocks_user_login_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_account_details_block_2" ADD CONSTRAINT "_pages_v_blocks_account_details_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_embed_block_2" ADD CONSTRAINT "_pages_v_blocks_embed_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_archive_block_2_order_idx" ON "pages_blocks_archive_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_block_2_parent_id_idx" ON "pages_blocks_archive_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_block_2_path_idx" ON "pages_blocks_archive_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_block_2_locale_idx" ON "pages_blocks_archive_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_archive_block_3_order_idx" ON "pages_blocks_archive_block_3" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_block_3_parent_id_idx" ON "pages_blocks_archive_block_3" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_block_3_path_idx" ON "pages_blocks_archive_block_3" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_block_3_locale_idx" ON "pages_blocks_archive_block_3" USING btree ("_locale");
  CREATE INDEX "cta_2_links_order_idx" ON "cta_2_links" USING btree ("_order");
  CREATE INDEX "cta_2_links_parent_id_idx" ON "cta_2_links" USING btree ("_parent_id");
  CREATE INDEX "cta_2_links_locale_idx" ON "cta_2_links" USING btree ("_locale");
  CREATE INDEX "cta_2_order_idx" ON "cta_2" USING btree ("_order");
  CREATE INDEX "cta_2_parent_id_idx" ON "cta_2" USING btree ("_parent_id");
  CREATE INDEX "cta_2_path_idx" ON "cta_2" USING btree ("_path");
  CREATE INDEX "cta_2_locale_idx" ON "cta_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_block_2_order_idx" ON "pages_blocks_form_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_2_parent_id_idx" ON "pages_blocks_form_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_2_path_idx" ON "pages_blocks_form_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_2_locale_idx" ON "pages_blocks_form_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_block_2_form_idx" ON "pages_blocks_form_block_2" USING btree ("form_id");
  CREATE INDEX "pages_blocks_media_block_2_order_idx" ON "pages_blocks_media_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_2_parent_id_idx" ON "pages_blocks_media_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_2_path_idx" ON "pages_blocks_media_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_2_locale_idx" ON "pages_blocks_media_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_media_block_2_media_idx" ON "pages_blocks_media_block_2" USING btree ("media_id");
  CREATE INDEX "pages_blocks_rich_text_block_2_links_order_idx" ON "pages_blocks_rich_text_block_2_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_block_2_links_parent_id_idx" ON "pages_blocks_rich_text_block_2_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_block_2_links_locale_idx" ON "pages_blocks_rich_text_block_2_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rich_text_block_2_order_idx" ON "pages_blocks_rich_text_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_block_2_parent_id_idx" ON "pages_blocks_rich_text_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_block_2_path_idx" ON "pages_blocks_rich_text_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_block_2_locale_idx" ON "pages_blocks_rich_text_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_user_login_block_2_order_idx" ON "pages_blocks_user_login_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_user_login_block_2_parent_id_idx" ON "pages_blocks_user_login_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_user_login_block_2_path_idx" ON "pages_blocks_user_login_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_user_login_block_2_locale_idx" ON "pages_blocks_user_login_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_account_details_block_2_order_idx" ON "pages_blocks_account_details_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_account_details_block_2_parent_id_idx" ON "pages_blocks_account_details_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_account_details_block_2_path_idx" ON "pages_blocks_account_details_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_account_details_block_2_locale_idx" ON "pages_blocks_account_details_block_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_embed_block_2_order_idx" ON "pages_blocks_embed_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_embed_block_2_parent_id_idx" ON "pages_blocks_embed_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_embed_block_2_path_idx" ON "pages_blocks_embed_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_embed_block_2_locale_idx" ON "pages_blocks_embed_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_archive_block_2_order_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_block_2_parent_id_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_block_2_path_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_block_2_locale_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_archive_block_3_order_idx" ON "_pages_v_blocks_archive_block_3" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_block_3_parent_id_idx" ON "_pages_v_blocks_archive_block_3" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_block_3_path_idx" ON "_pages_v_blocks_archive_block_3" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_block_3_locale_idx" ON "_pages_v_blocks_archive_block_3" USING btree ("_locale");
  CREATE INDEX "_cta_v_2_links_order_idx" ON "_cta_v_2_links" USING btree ("_order");
  CREATE INDEX "_cta_v_2_links_parent_id_idx" ON "_cta_v_2_links" USING btree ("_parent_id");
  CREATE INDEX "_cta_v_2_links_locale_idx" ON "_cta_v_2_links" USING btree ("_locale");
  CREATE INDEX "_cta_v_2_order_idx" ON "_cta_v_2" USING btree ("_order");
  CREATE INDEX "_cta_v_2_parent_id_idx" ON "_cta_v_2" USING btree ("_parent_id");
  CREATE INDEX "_cta_v_2_path_idx" ON "_cta_v_2" USING btree ("_path");
  CREATE INDEX "_cta_v_2_locale_idx" ON "_cta_v_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_block_2_order_idx" ON "_pages_v_blocks_form_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_2_parent_id_idx" ON "_pages_v_blocks_form_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_2_path_idx" ON "_pages_v_blocks_form_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_2_locale_idx" ON "_pages_v_blocks_form_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_block_2_form_idx" ON "_pages_v_blocks_form_block_2" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_media_block_2_order_idx" ON "_pages_v_blocks_media_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_2_parent_id_idx" ON "_pages_v_blocks_media_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_2_path_idx" ON "_pages_v_blocks_media_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_2_locale_idx" ON "_pages_v_blocks_media_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_media_block_2_media_idx" ON "_pages_v_blocks_media_block_2" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_rich_text_block_2_links_order_idx" ON "_pages_v_blocks_rich_text_block_2_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_block_2_links_parent_id_idx" ON "_pages_v_blocks_rich_text_block_2_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_block_2_links_locale_idx" ON "_pages_v_blocks_rich_text_block_2_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_rich_text_block_2_order_idx" ON "_pages_v_blocks_rich_text_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_block_2_parent_id_idx" ON "_pages_v_blocks_rich_text_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_block_2_path_idx" ON "_pages_v_blocks_rich_text_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_block_2_locale_idx" ON "_pages_v_blocks_rich_text_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_order_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_parent_id_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_path_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_user_login_block_2_locale_idx" ON "_pages_v_blocks_user_login_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_order_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_parent_id_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_path_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_account_details_block_2_locale_idx" ON "_pages_v_blocks_account_details_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_embed_block_2_order_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_embed_block_2_parent_id_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_embed_block_2_path_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_embed_block_2_locale_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_locale");
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";`)
}
