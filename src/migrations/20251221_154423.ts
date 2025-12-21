import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_archive_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_content_2_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_2_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_2_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_pages_blocks_content_3_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_3_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_3_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_media_block_2_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_content_2_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_2_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_2_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__pages_v_blocks_content_3_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_3_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_3_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_2_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TABLE "pages_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_archive_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_2_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_2_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_2_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_2_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_2_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_2_section_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive_3" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_3_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_3_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_2_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_2_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_2_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_3_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_3_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_3_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_3_section_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content_3" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
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
  
  CREATE TABLE "_pages_v_version_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_archive_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_2_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_2_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_2_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_2_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_2_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_2_section_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive_3" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_3_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_3_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_2_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_2_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_2_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_3_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_3_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_3_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_3_section_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_3" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
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
  
  CREATE TABLE "header_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_hero_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk";
  
  DROP INDEX "posts_hero_image_idx";
  DROP INDEX "_posts_v_version_version_hero_image_idx";
  DROP INDEX "search_slug_idx";
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "pages_rels_pages_id_idx";
  DROP INDEX "pages_rels_posts_id_idx";
  DROP INDEX "pages_rels_categories_id_idx";
  DROP INDEX "pages_rels_people_id_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "_pages_v_rels_pages_id_idx";
  DROP INDEX "_pages_v_rels_posts_id_idx";
  DROP INDEX "_pages_v_rels_categories_id_idx";
  DROP INDEX "_pages_v_rels_people_id_idx";
  DROP INDEX "posts_meta_meta_image_idx";
  DROP INDEX "_posts_v_version_meta_version_meta_image_idx";
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_content_section" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_rich_text_block_links" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_rich_text_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_two_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_card_carousel_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_card_block_cards" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_card_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_user_login" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_blocks_people_archive" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "pages_locales" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_content_section" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_rich_text_block_links" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_two_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_card_block_cards" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_card_block" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_user_login" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_blocks_people_archive" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "posts_locales" ADD COLUMN "title" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "posts_locales" ADD COLUMN "content" jsonb;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_hero_image_id" integer;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "search_locales" ADD COLUMN "slug" varchar;
  ALTER TABLE "pages_hero_links_locales" ADD CONSTRAINT "pages_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_2" ADD CONSTRAINT "pages_blocks_archive_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_2_section" ADD CONSTRAINT "pages_blocks_content_2_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_2" ADD CONSTRAINT "pages_blocks_content_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_3" ADD CONSTRAINT "pages_blocks_archive_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_2_links" ADD CONSTRAINT "pages_blocks_cta_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_2" ADD CONSTRAINT "pages_blocks_cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_3_section" ADD CONSTRAINT "pages_blocks_content_3_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_3" ADD CONSTRAINT "pages_blocks_content_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block_2" ADD CONSTRAINT "pages_blocks_form_block_2_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block_2" ADD CONSTRAINT "pages_blocks_form_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block_2" ADD CONSTRAINT "pages_blocks_media_block_2_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block_2" ADD CONSTRAINT "pages_blocks_media_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_block_2_links" ADD CONSTRAINT "pages_blocks_rich_text_block_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text_block_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_block_2" ADD CONSTRAINT "pages_blocks_rich_text_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links_locales" ADD CONSTRAINT "_pages_v_version_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_2" ADD CONSTRAINT "_pages_v_blocks_archive_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_2_section" ADD CONSTRAINT "_pages_v_blocks_content_2_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_2" ADD CONSTRAINT "_pages_v_blocks_content_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_3" ADD CONSTRAINT "_pages_v_blocks_archive_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_2_links" ADD CONSTRAINT "_pages_v_blocks_cta_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_2" ADD CONSTRAINT "_pages_v_blocks_cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_3_section" ADD CONSTRAINT "_pages_v_blocks_content_3_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_3" ADD CONSTRAINT "_pages_v_blocks_content_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_2" ADD CONSTRAINT "_pages_v_blocks_form_block_2_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_2" ADD CONSTRAINT "_pages_v_blocks_form_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block_2" ADD CONSTRAINT "_pages_v_blocks_media_block_2_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block_2" ADD CONSTRAINT "_pages_v_blocks_media_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_block_2_links" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text_block_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_block_2" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_locales" ADD CONSTRAINT "header_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items_locales" ADD CONSTRAINT "footer_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_hero_links_locales_locale_parent_id_unique" ON "pages_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_archive_2_order_idx" ON "pages_blocks_archive_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_2_parent_id_idx" ON "pages_blocks_archive_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_2_path_idx" ON "pages_blocks_archive_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_2_locale_idx" ON "pages_blocks_archive_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_2_section_order_idx" ON "pages_blocks_content_2_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_2_section_parent_id_idx" ON "pages_blocks_content_2_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_2_section_locale_idx" ON "pages_blocks_content_2_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_2_order_idx" ON "pages_blocks_content_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_2_parent_id_idx" ON "pages_blocks_content_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_2_path_idx" ON "pages_blocks_content_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_2_locale_idx" ON "pages_blocks_content_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_archive_3_order_idx" ON "pages_blocks_archive_3" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_3_parent_id_idx" ON "pages_blocks_archive_3" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_3_path_idx" ON "pages_blocks_archive_3" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_3_locale_idx" ON "pages_blocks_archive_3" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_2_links_order_idx" ON "pages_blocks_cta_2_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_2_links_parent_id_idx" ON "pages_blocks_cta_2_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_2_links_locale_idx" ON "pages_blocks_cta_2_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_2_order_idx" ON "pages_blocks_cta_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_2_parent_id_idx" ON "pages_blocks_cta_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_2_path_idx" ON "pages_blocks_cta_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_2_locale_idx" ON "pages_blocks_cta_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_3_section_order_idx" ON "pages_blocks_content_3_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_3_section_parent_id_idx" ON "pages_blocks_content_3_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_3_section_locale_idx" ON "pages_blocks_content_3_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_3_order_idx" ON "pages_blocks_content_3" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_3_parent_id_idx" ON "pages_blocks_content_3" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_3_path_idx" ON "pages_blocks_content_3" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_3_locale_idx" ON "pages_blocks_content_3" USING btree ("_locale");
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
  CREATE UNIQUE INDEX "_pages_v_version_hero_links_locales_locale_parent_id_unique" ON "_pages_v_version_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_2_order_idx" ON "_pages_v_blocks_archive_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_2_parent_id_idx" ON "_pages_v_blocks_archive_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_2_path_idx" ON "_pages_v_blocks_archive_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_2_locale_idx" ON "_pages_v_blocks_archive_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_2_section_order_idx" ON "_pages_v_blocks_content_2_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_2_section_parent_id_idx" ON "_pages_v_blocks_content_2_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_2_section_locale_idx" ON "_pages_v_blocks_content_2_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_2_order_idx" ON "_pages_v_blocks_content_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_2_parent_id_idx" ON "_pages_v_blocks_content_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_2_path_idx" ON "_pages_v_blocks_content_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_2_locale_idx" ON "_pages_v_blocks_content_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_archive_3_order_idx" ON "_pages_v_blocks_archive_3" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_3_parent_id_idx" ON "_pages_v_blocks_archive_3" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_3_path_idx" ON "_pages_v_blocks_archive_3" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_3_locale_idx" ON "_pages_v_blocks_archive_3" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_2_links_order_idx" ON "_pages_v_blocks_cta_2_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_2_links_parent_id_idx" ON "_pages_v_blocks_cta_2_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_2_links_locale_idx" ON "_pages_v_blocks_cta_2_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_2_order_idx" ON "_pages_v_blocks_cta_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_2_parent_id_idx" ON "_pages_v_blocks_cta_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_2_path_idx" ON "_pages_v_blocks_cta_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_2_locale_idx" ON "_pages_v_blocks_cta_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_3_section_order_idx" ON "_pages_v_blocks_content_3_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_3_section_parent_id_idx" ON "_pages_v_blocks_content_3_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_3_section_locale_idx" ON "_pages_v_blocks_content_3_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_3_order_idx" ON "_pages_v_blocks_content_3" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_3_parent_id_idx" ON "_pages_v_blocks_content_3" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_3_path_idx" ON "_pages_v_blocks_content_3" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_3_locale_idx" ON "_pages_v_blocks_content_3" USING btree ("_locale");
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
  CREATE UNIQUE INDEX "header_nav_items_locales_locale_parent_id_unique" ON "header_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_nav_items_locales_locale_parent_id_unique" ON "footer_nav_items_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_archive_locale_idx" ON "pages_blocks_archive" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_section_locale_idx" ON "pages_blocks_content_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_locale_idx" ON "pages_blocks_content" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_links_locale_idx" ON "pages_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_locale_idx" ON "pages_blocks_cta" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_block_locale_idx" ON "pages_blocks_form_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_media_block_locale_idx" ON "pages_blocks_media_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rich_text_block_links_locale_idx" ON "pages_blocks_rich_text_block_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rich_text_block_locale_idx" ON "pages_blocks_rich_text_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_two_block_locale_idx" ON "pages_blocks_two_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_carousel_block_cards_locale_idx" ON "pages_blocks_card_carousel_block_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_carousel_block_locale_idx" ON "pages_blocks_card_carousel_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_block_cards_locale_idx" ON "pages_blocks_card_block_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_block_locale_idx" ON "pages_blocks_card_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_user_login_locale_idx" ON "pages_blocks_user_login" USING btree ("_locale");
  CREATE INDEX "pages_blocks_people_archive_locale_idx" ON "pages_blocks_people_archive" USING btree ("_locale");
  CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX "_pages_v_blocks_archive_locale_idx" ON "_pages_v_blocks_archive" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_section_locale_idx" ON "_pages_v_blocks_content_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_locale_idx" ON "_pages_v_blocks_content" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_links_locale_idx" ON "_pages_v_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_locale_idx" ON "_pages_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_block_locale_idx" ON "_pages_v_blocks_form_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_media_block_locale_idx" ON "_pages_v_blocks_media_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_rich_text_block_links_locale_idx" ON "_pages_v_blocks_rich_text_block_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_rich_text_block_locale_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_two_block_locale_idx" ON "_pages_v_blocks_two_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_cards_locale_idx" ON "_pages_v_blocks_card_carousel_block_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_locale_idx" ON "_pages_v_blocks_card_carousel_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_block_cards_locale_idx" ON "_pages_v_blocks_card_block_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_block_locale_idx" ON "_pages_v_blocks_card_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_user_login_locale_idx" ON "_pages_v_blocks_user_login" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_people_archive_locale_idx" ON "_pages_v_blocks_people_archive" USING btree ("_locale");
  CREATE INDEX "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX "posts_hero_image_idx" ON "posts_locales" USING btree ("hero_image_id","_locale");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v_locales" USING btree ("version_hero_image_id","_locale");
  CREATE INDEX "search_slug_idx" ON "search_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id","locale");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id","locale");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id","locale");
  CREATE INDEX "pages_rels_people_id_idx" ON "pages_rels" USING btree ("people_id","locale");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id","locale");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id","locale");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id","locale");
  CREATE INDEX "_pages_v_rels_people_id_idx" ON "_pages_v_rels" USING btree ("people_id","locale");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id");
  ALTER TABLE "pages_hero_links" DROP COLUMN "link_label";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "_pages_v_version_hero_links" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_title";
  ALTER TABLE "posts" DROP COLUMN "title";
  ALTER TABLE "posts" DROP COLUMN "hero_image_id";
  ALTER TABLE "posts" DROP COLUMN "content";
  ALTER TABLE "_posts_v" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content";
  ALTER TABLE "search" DROP COLUMN "slug";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_label";
  ALTER TABLE "footer_nav_items" DROP COLUMN "link_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_archive_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content_2_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_archive_3" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_2_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content_3_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content_3" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form_block_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_block_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_block_2_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_block_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_archive_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_2_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_archive_3" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_2_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_3_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_3" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form_block_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_block_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_block_2_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_block_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_links_locales" CASCADE;
  DROP TABLE "pages_blocks_archive_2" CASCADE;
  DROP TABLE "pages_blocks_content_2_section" CASCADE;
  DROP TABLE "pages_blocks_content_2" CASCADE;
  DROP TABLE "pages_blocks_archive_3" CASCADE;
  DROP TABLE "pages_blocks_cta_2_links" CASCADE;
  DROP TABLE "pages_blocks_cta_2" CASCADE;
  DROP TABLE "pages_blocks_content_3_section" CASCADE;
  DROP TABLE "pages_blocks_content_3" CASCADE;
  DROP TABLE "pages_blocks_form_block_2" CASCADE;
  DROP TABLE "pages_blocks_media_block_2" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block_2_links" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block_2" CASCADE;
  DROP TABLE "_pages_v_version_hero_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_2" CASCADE;
  DROP TABLE "_pages_v_blocks_content_2_section" CASCADE;
  DROP TABLE "_pages_v_blocks_content_2" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_3" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_2_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_2" CASCADE;
  DROP TABLE "_pages_v_blocks_content_3_section" CASCADE;
  DROP TABLE "_pages_v_blocks_content_3" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block_2_links" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block_2" CASCADE;
  DROP TABLE "header_nav_items_locales" CASCADE;
  DROP TABLE "footer_nav_items_locales" CASCADE;
  ALTER TABLE "posts_locales" DROP CONSTRAINT "posts_locales_hero_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v_locales" DROP CONSTRAINT "_posts_v_locales_version_hero_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_archive_locale_idx";
  DROP INDEX "pages_blocks_content_section_locale_idx";
  DROP INDEX "pages_blocks_content_locale_idx";
  DROP INDEX "pages_blocks_cta_links_locale_idx";
  DROP INDEX "pages_blocks_cta_locale_idx";
  DROP INDEX "pages_blocks_form_block_locale_idx";
  DROP INDEX "pages_blocks_media_block_locale_idx";
  DROP INDEX "pages_blocks_rich_text_block_links_locale_idx";
  DROP INDEX "pages_blocks_rich_text_block_locale_idx";
  DROP INDEX "pages_blocks_two_block_locale_idx";
  DROP INDEX "pages_blocks_card_carousel_block_cards_locale_idx";
  DROP INDEX "pages_blocks_card_carousel_block_locale_idx";
  DROP INDEX "pages_blocks_card_block_cards_locale_idx";
  DROP INDEX "pages_blocks_card_block_locale_idx";
  DROP INDEX "pages_blocks_user_login_locale_idx";
  DROP INDEX "pages_blocks_people_archive_locale_idx";
  DROP INDEX "pages_rels_locale_idx";
  DROP INDEX "_pages_v_blocks_archive_locale_idx";
  DROP INDEX "_pages_v_blocks_content_section_locale_idx";
  DROP INDEX "_pages_v_blocks_content_locale_idx";
  DROP INDEX "_pages_v_blocks_cta_links_locale_idx";
  DROP INDEX "_pages_v_blocks_cta_locale_idx";
  DROP INDEX "_pages_v_blocks_form_block_locale_idx";
  DROP INDEX "_pages_v_blocks_media_block_locale_idx";
  DROP INDEX "_pages_v_blocks_rich_text_block_links_locale_idx";
  DROP INDEX "_pages_v_blocks_rich_text_block_locale_idx";
  DROP INDEX "_pages_v_blocks_two_block_locale_idx";
  DROP INDEX "_pages_v_blocks_card_carousel_block_cards_locale_idx";
  DROP INDEX "_pages_v_blocks_card_carousel_block_locale_idx";
  DROP INDEX "_pages_v_blocks_card_block_cards_locale_idx";
  DROP INDEX "_pages_v_blocks_card_block_locale_idx";
  DROP INDEX "_pages_v_blocks_user_login_locale_idx";
  DROP INDEX "_pages_v_blocks_people_archive_locale_idx";
  DROP INDEX "_pages_v_rels_locale_idx";
  DROP INDEX "posts_hero_image_idx";
  DROP INDEX "_posts_v_version_version_hero_image_idx";
  DROP INDEX "search_slug_idx";
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "pages_rels_pages_id_idx";
  DROP INDEX "pages_rels_posts_id_idx";
  DROP INDEX "pages_rels_categories_id_idx";
  DROP INDEX "pages_rels_people_id_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "_pages_v_rels_pages_id_idx";
  DROP INDEX "_pages_v_rels_posts_id_idx";
  DROP INDEX "_pages_v_rels_categories_id_idx";
  DROP INDEX "_pages_v_rels_people_id_idx";
  DROP INDEX "posts_meta_meta_image_idx";
  DROP INDEX "_posts_v_version_meta_version_meta_image_idx";
  ALTER TABLE "pages_hero_links" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "search" ADD COLUMN "slug" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "footer_nav_items" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "pages_rels_people_id_idx" ON "pages_rels" USING btree ("people_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_rels_people_id_idx" ON "_pages_v_rels" USING btree ("people_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_content_section" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_rich_text_block_links" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_rich_text_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_two_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_card_carousel_block_cards" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_card_carousel_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_card_block_cards" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_card_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_user_login" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_people_archive" DROP COLUMN "_locale";
  ALTER TABLE "pages_locales" DROP COLUMN "title";
  ALTER TABLE "pages_rels" DROP COLUMN "locale";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_content_section" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_rich_text_block_links" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_rich_text_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_two_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_card_carousel_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_card_block_cards" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_card_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_user_login" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_people_archive" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_title";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "locale";
  ALTER TABLE "posts_locales" DROP COLUMN "title";
  ALTER TABLE "posts_locales" DROP COLUMN "hero_image_id";
  ALTER TABLE "posts_locales" DROP COLUMN "content";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_hero_image_id";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_content";
  ALTER TABLE "search_locales" DROP COLUMN "slug";
  DROP TYPE "public"."enum_pages_blocks_archive_2_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_2_relation_to";
  DROP TYPE "public"."enum_pages_blocks_content_2_section_size";
  DROP TYPE "public"."enum_pages_blocks_content_2_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_2_section_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_3_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_3_relation_to";
  DROP TYPE "public"."enum_pages_blocks_cta_2_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_2_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_3_section_size";
  DROP TYPE "public"."enum_pages_blocks_content_3_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_3_section_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_media_block_2_media_type";
  DROP TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_rich_text_block_2_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_2_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_2_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_content_2_section_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_2_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_2_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_3_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_3_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_3_section_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_3_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_3_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_2_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_block_2_links_link_appearance";`)
}
