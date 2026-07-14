import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_archive_block_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_content_block_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_block_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_block_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_cta_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_block_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_cta_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_cta_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_twoColumn_background_mode" AS ENUM('color', 'media');
  CREATE TYPE "public"."enum_twoColumn_text_color_mode" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum_twoColumn_background_variant" AS ENUM('default', 'accent', 'secondary', 'dark', 'neutral');
  CREATE TYPE "public"."enum_cardCarousel_cards_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_cardCarousel_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum_peopleArchive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_content_block_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_block_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_block_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__cta_v_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__cta_v_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_block_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__cta_v_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__cta_v_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__twoColumn_v_background_mode" AS ENUM('color', 'media');
  CREATE TYPE "public"."enum__twoColumn_v_text_color_mode" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum__twoColumn_v_background_variant" AS ENUM('default', 'accent', 'secondary', 'dark', 'neutral');
  CREATE TYPE "public"."enum__cardCarousel_v_cards_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__cardCarousel_v_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum__peopleArchive_v_populate_by" AS ENUM('collection', 'selection');
  CREATE TABLE "pages_blocks_archive_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_block_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_block_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_block_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_block_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_block_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_block_section_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"centered" boolean DEFAULT false,
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
  
  CREATE TABLE "twoColumn" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enable_background" boolean DEFAULT false,
  	"background_mode" "enum_twoColumn_background_mode" DEFAULT 'color',
  	"background_media_id" integer,
  	"text_color_mode" "enum_twoColumn_text_color_mode" DEFAULT 'white',
  	"background_variant" "enum_twoColumn_background_variant" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "cardCarousel_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "enum_cardCarousel_cards_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "cardCarousel_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "cardCarousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"card_type" "enum_cardCarousel_card_type" DEFAULT 'link',
  	"card_background_color" "bg" DEFAULT '',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_user_login_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "peopleArchive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_peopleArchive_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"enable_pagination" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_promo_strip_block_usps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_promo_strip_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accordion_block_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"side_by_side_with_intro" boolean DEFAULT false,
  	"single_open" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_block_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_block_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_block_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_block_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_block_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_block_section_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_cta_v_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__cta_v_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__cta_v_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cta_v" (
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
  
  CREATE TABLE "_twoColumn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enable_background" boolean DEFAULT false,
  	"background_mode" "enum__twoColumn_v_background_mode" DEFAULT 'color',
  	"background_media_id" integer,
  	"text_color_mode" "enum__twoColumn_v_text_color_mode" DEFAULT 'white',
  	"background_variant" "enum__twoColumn_v_background_variant" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_cardCarousel_v_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "enum__cardCarousel_v_cards_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cardCarousel_v_info_cards" (
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
  
  CREATE TABLE "_cardCarousel_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"card_type" "enum__cardCarousel_v_card_type" DEFAULT 'link',
  	"card_background_color" "bg" DEFAULT '',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_user_login_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_peopleArchive_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__peopleArchive_v_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"enable_pagination" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_strip_block_usps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_strip_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_block_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"side_by_side_with_intro" boolean DEFAULT false,
  	"single_open" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_content_section" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_archive_2" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_archive_3" CASCADE;
  DROP TABLE "pages_blocks_cta_2_links" CASCADE;
  DROP TABLE "pages_blocks_cta_2" CASCADE;
  DROP TABLE "pages_blocks_two_block" CASCADE;
  DROP TABLE "pages_blocks_card_carousel_block_cards" CASCADE;
  DROP TABLE "pages_blocks_card_carousel_block_info_cards" CASCADE;
  DROP TABLE "pages_blocks_card_carousel_block" CASCADE;
  DROP TABLE "pages_blocks_user_login" CASCADE;
  DROP TABLE "pages_blocks_people_archive" CASCADE;
  DROP TABLE "pages_blocks_promo_strip_usps" CASCADE;
  DROP TABLE "pages_blocks_promo_strip" CASCADE;
  DROP TABLE "pages_blocks_accordion_accordions" CASCADE;
  DROP TABLE "pages_blocks_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_content_section" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_2" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_3" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_2_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_2" CASCADE;
  DROP TABLE "_pages_v_blocks_two_block" CASCADE;
  DROP TABLE "_pages_v_blocks_card_carousel_block_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_carousel_block_info_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_carousel_block" CASCADE;
  DROP TABLE "_pages_v_blocks_user_login" CASCADE;
  DROP TABLE "_pages_v_blocks_people_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_strip_usps" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_accordions" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion" CASCADE;
  ALTER TABLE "pages_blocks_archive_block" ADD CONSTRAINT "pages_blocks_archive_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_block_section" ADD CONSTRAINT "pages_blocks_content_block_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_block" ADD CONSTRAINT "pages_blocks_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_block_2" ADD CONSTRAINT "pages_blocks_archive_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_links" ADD CONSTRAINT "cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta" ADD CONSTRAINT "cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_block_3" ADD CONSTRAINT "pages_blocks_archive_block_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_2_links" ADD CONSTRAINT "cta_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_2" ADD CONSTRAINT "cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "twoColumn" ADD CONSTRAINT "twoColumn_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "twoColumn" ADD CONSTRAINT "twoColumn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cardCarousel_cards" ADD CONSTRAINT "cardCarousel_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cardCarousel_cards" ADD CONSTRAINT "cardCarousel_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cardCarousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cardCarousel_info_cards" ADD CONSTRAINT "cardCarousel_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cardCarousel_info_cards" ADD CONSTRAINT "cardCarousel_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cardCarousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cardCarousel" ADD CONSTRAINT "cardCarousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_user_login_block" ADD CONSTRAINT "pages_blocks_user_login_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "peopleArchive" ADD CONSTRAINT "peopleArchive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_strip_block_usps" ADD CONSTRAINT "pages_blocks_promo_strip_block_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promo_strip_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_strip_block" ADD CONSTRAINT "pages_blocks_promo_strip_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_block_accordions" ADD CONSTRAINT "pages_blocks_accordion_block_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_block" ADD CONSTRAINT "pages_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_block" ADD CONSTRAINT "_pages_v_blocks_archive_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_block_section" ADD CONSTRAINT "_pages_v_blocks_content_block_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_block" ADD CONSTRAINT "_pages_v_blocks_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_block_2" ADD CONSTRAINT "_pages_v_blocks_archive_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_v_links" ADD CONSTRAINT "_cta_v_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_v" ADD CONSTRAINT "_cta_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_block_3" ADD CONSTRAINT "_pages_v_blocks_archive_block_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_v_2_links" ADD CONSTRAINT "_cta_v_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cta_v_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_v_2" ADD CONSTRAINT "_cta_v_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_twoColumn_v" ADD CONSTRAINT "_twoColumn_v_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_twoColumn_v" ADD CONSTRAINT "_twoColumn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cardCarousel_v_cards" ADD CONSTRAINT "_cardCarousel_v_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cardCarousel_v_cards" ADD CONSTRAINT "_cardCarousel_v_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cardCarousel_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cardCarousel_v_info_cards" ADD CONSTRAINT "_cardCarousel_v_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cardCarousel_v_info_cards" ADD CONSTRAINT "_cardCarousel_v_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cardCarousel_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cardCarousel_v" ADD CONSTRAINT "_cardCarousel_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_user_login_block" ADD CONSTRAINT "_pages_v_blocks_user_login_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_peopleArchive_v" ADD CONSTRAINT "_peopleArchive_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip_block_usps" ADD CONSTRAINT "_pages_v_blocks_promo_strip_block_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promo_strip_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip_block" ADD CONSTRAINT "_pages_v_blocks_promo_strip_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_block_accordions" ADD CONSTRAINT "_pages_v_blocks_accordion_block_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_block" ADD CONSTRAINT "_pages_v_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_archive_block_order_idx" ON "pages_blocks_archive_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_block_parent_id_idx" ON "pages_blocks_archive_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_block_path_idx" ON "pages_blocks_archive_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_block_locale_idx" ON "pages_blocks_archive_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_block_section_order_idx" ON "pages_blocks_content_block_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_block_section_parent_id_idx" ON "pages_blocks_content_block_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_block_section_locale_idx" ON "pages_blocks_content_block_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_block_order_idx" ON "pages_blocks_content_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_block_parent_id_idx" ON "pages_blocks_content_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_block_path_idx" ON "pages_blocks_content_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_block_locale_idx" ON "pages_blocks_content_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_archive_block_2_order_idx" ON "pages_blocks_archive_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_block_2_parent_id_idx" ON "pages_blocks_archive_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_block_2_path_idx" ON "pages_blocks_archive_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_block_2_locale_idx" ON "pages_blocks_archive_block_2" USING btree ("_locale");
  CREATE INDEX "cta_links_order_idx" ON "cta_links" USING btree ("_order");
  CREATE INDEX "cta_links_parent_id_idx" ON "cta_links" USING btree ("_parent_id");
  CREATE INDEX "cta_links_locale_idx" ON "cta_links" USING btree ("_locale");
  CREATE INDEX "cta_order_idx" ON "cta" USING btree ("_order");
  CREATE INDEX "cta_parent_id_idx" ON "cta" USING btree ("_parent_id");
  CREATE INDEX "cta_path_idx" ON "cta" USING btree ("_path");
  CREATE INDEX "cta_locale_idx" ON "cta" USING btree ("_locale");
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
  CREATE INDEX "twoColumn_order_idx" ON "twoColumn" USING btree ("_order");
  CREATE INDEX "twoColumn_parent_id_idx" ON "twoColumn" USING btree ("_parent_id");
  CREATE INDEX "twoColumn_path_idx" ON "twoColumn" USING btree ("_path");
  CREATE INDEX "twoColumn_locale_idx" ON "twoColumn" USING btree ("_locale");
  CREATE INDEX "twoColumn_background_media_idx" ON "twoColumn" USING btree ("background_media_id");
  CREATE INDEX "cardCarousel_cards_order_idx" ON "cardCarousel_cards" USING btree ("_order");
  CREATE INDEX "cardCarousel_cards_parent_id_idx" ON "cardCarousel_cards" USING btree ("_parent_id");
  CREATE INDEX "cardCarousel_cards_locale_idx" ON "cardCarousel_cards" USING btree ("_locale");
  CREATE INDEX "cardCarousel_cards_media_idx" ON "cardCarousel_cards" USING btree ("media_id");
  CREATE INDEX "cardCarousel_info_cards_order_idx" ON "cardCarousel_info_cards" USING btree ("_order");
  CREATE INDEX "cardCarousel_info_cards_parent_id_idx" ON "cardCarousel_info_cards" USING btree ("_parent_id");
  CREATE INDEX "cardCarousel_info_cards_locale_idx" ON "cardCarousel_info_cards" USING btree ("_locale");
  CREATE INDEX "cardCarousel_info_cards_media_idx" ON "cardCarousel_info_cards" USING btree ("media_id");
  CREATE INDEX "cardCarousel_order_idx" ON "cardCarousel" USING btree ("_order");
  CREATE INDEX "cardCarousel_parent_id_idx" ON "cardCarousel" USING btree ("_parent_id");
  CREATE INDEX "cardCarousel_path_idx" ON "cardCarousel" USING btree ("_path");
  CREATE INDEX "cardCarousel_locale_idx" ON "cardCarousel" USING btree ("_locale");
  CREATE INDEX "pages_blocks_user_login_block_order_idx" ON "pages_blocks_user_login_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_user_login_block_parent_id_idx" ON "pages_blocks_user_login_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_user_login_block_path_idx" ON "pages_blocks_user_login_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_user_login_block_locale_idx" ON "pages_blocks_user_login_block" USING btree ("_locale");
  CREATE INDEX "peopleArchive_order_idx" ON "peopleArchive" USING btree ("_order");
  CREATE INDEX "peopleArchive_parent_id_idx" ON "peopleArchive" USING btree ("_parent_id");
  CREATE INDEX "peopleArchive_path_idx" ON "peopleArchive" USING btree ("_path");
  CREATE INDEX "peopleArchive_locale_idx" ON "peopleArchive" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promo_strip_block_usps_order_idx" ON "pages_blocks_promo_strip_block_usps" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_strip_block_usps_parent_id_idx" ON "pages_blocks_promo_strip_block_usps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_strip_block_usps_locale_idx" ON "pages_blocks_promo_strip_block_usps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promo_strip_block_order_idx" ON "pages_blocks_promo_strip_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_strip_block_parent_id_idx" ON "pages_blocks_promo_strip_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_strip_block_path_idx" ON "pages_blocks_promo_strip_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_promo_strip_block_locale_idx" ON "pages_blocks_promo_strip_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_block_accordions_order_idx" ON "pages_blocks_accordion_block_accordions" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_block_accordions_parent_id_idx" ON "pages_blocks_accordion_block_accordions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_block_accordions_locale_idx" ON "pages_blocks_accordion_block_accordions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_block_order_idx" ON "pages_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_block_parent_id_idx" ON "pages_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_block_path_idx" ON "pages_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_block_locale_idx" ON "pages_blocks_accordion_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_archive_block_order_idx" ON "_pages_v_blocks_archive_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_block_parent_id_idx" ON "_pages_v_blocks_archive_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_block_path_idx" ON "_pages_v_blocks_archive_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_block_locale_idx" ON "_pages_v_blocks_archive_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_block_section_order_idx" ON "_pages_v_blocks_content_block_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_block_section_parent_id_idx" ON "_pages_v_blocks_content_block_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_block_section_locale_idx" ON "_pages_v_blocks_content_block_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_block_order_idx" ON "_pages_v_blocks_content_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_block_parent_id_idx" ON "_pages_v_blocks_content_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_block_path_idx" ON "_pages_v_blocks_content_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_block_locale_idx" ON "_pages_v_blocks_content_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_archive_block_2_order_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_block_2_parent_id_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_block_2_path_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_block_2_locale_idx" ON "_pages_v_blocks_archive_block_2" USING btree ("_locale");
  CREATE INDEX "_cta_v_links_order_idx" ON "_cta_v_links" USING btree ("_order");
  CREATE INDEX "_cta_v_links_parent_id_idx" ON "_cta_v_links" USING btree ("_parent_id");
  CREATE INDEX "_cta_v_links_locale_idx" ON "_cta_v_links" USING btree ("_locale");
  CREATE INDEX "_cta_v_order_idx" ON "_cta_v" USING btree ("_order");
  CREATE INDEX "_cta_v_parent_id_idx" ON "_cta_v" USING btree ("_parent_id");
  CREATE INDEX "_cta_v_path_idx" ON "_cta_v" USING btree ("_path");
  CREATE INDEX "_cta_v_locale_idx" ON "_cta_v" USING btree ("_locale");
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
  CREATE INDEX "_twoColumn_v_order_idx" ON "_twoColumn_v" USING btree ("_order");
  CREATE INDEX "_twoColumn_v_parent_id_idx" ON "_twoColumn_v" USING btree ("_parent_id");
  CREATE INDEX "_twoColumn_v_path_idx" ON "_twoColumn_v" USING btree ("_path");
  CREATE INDEX "_twoColumn_v_locale_idx" ON "_twoColumn_v" USING btree ("_locale");
  CREATE INDEX "_twoColumn_v_background_media_idx" ON "_twoColumn_v" USING btree ("background_media_id");
  CREATE INDEX "_cardCarousel_v_cards_order_idx" ON "_cardCarousel_v_cards" USING btree ("_order");
  CREATE INDEX "_cardCarousel_v_cards_parent_id_idx" ON "_cardCarousel_v_cards" USING btree ("_parent_id");
  CREATE INDEX "_cardCarousel_v_cards_locale_idx" ON "_cardCarousel_v_cards" USING btree ("_locale");
  CREATE INDEX "_cardCarousel_v_cards_media_idx" ON "_cardCarousel_v_cards" USING btree ("media_id");
  CREATE INDEX "_cardCarousel_v_info_cards_order_idx" ON "_cardCarousel_v_info_cards" USING btree ("_order");
  CREATE INDEX "_cardCarousel_v_info_cards_parent_id_idx" ON "_cardCarousel_v_info_cards" USING btree ("_parent_id");
  CREATE INDEX "_cardCarousel_v_info_cards_locale_idx" ON "_cardCarousel_v_info_cards" USING btree ("_locale");
  CREATE INDEX "_cardCarousel_v_info_cards_media_idx" ON "_cardCarousel_v_info_cards" USING btree ("media_id");
  CREATE INDEX "_cardCarousel_v_order_idx" ON "_cardCarousel_v" USING btree ("_order");
  CREATE INDEX "_cardCarousel_v_parent_id_idx" ON "_cardCarousel_v" USING btree ("_parent_id");
  CREATE INDEX "_cardCarousel_v_path_idx" ON "_cardCarousel_v" USING btree ("_path");
  CREATE INDEX "_cardCarousel_v_locale_idx" ON "_cardCarousel_v" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_user_login_block_order_idx" ON "_pages_v_blocks_user_login_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_user_login_block_parent_id_idx" ON "_pages_v_blocks_user_login_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_user_login_block_path_idx" ON "_pages_v_blocks_user_login_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_user_login_block_locale_idx" ON "_pages_v_blocks_user_login_block" USING btree ("_locale");
  CREATE INDEX "_peopleArchive_v_order_idx" ON "_peopleArchive_v" USING btree ("_order");
  CREATE INDEX "_peopleArchive_v_parent_id_idx" ON "_peopleArchive_v" USING btree ("_parent_id");
  CREATE INDEX "_peopleArchive_v_path_idx" ON "_peopleArchive_v" USING btree ("_path");
  CREATE INDEX "_peopleArchive_v_locale_idx" ON "_peopleArchive_v" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_strip_block_usps_order_idx" ON "_pages_v_blocks_promo_strip_block_usps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_strip_block_usps_parent_id_idx" ON "_pages_v_blocks_promo_strip_block_usps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_block_usps_locale_idx" ON "_pages_v_blocks_promo_strip_block_usps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_strip_block_order_idx" ON "_pages_v_blocks_promo_strip_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_strip_block_parent_id_idx" ON "_pages_v_blocks_promo_strip_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_block_path_idx" ON "_pages_v_blocks_promo_strip_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_promo_strip_block_locale_idx" ON "_pages_v_blocks_promo_strip_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_block_accordions_order_idx" ON "_pages_v_blocks_accordion_block_accordions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_block_accordions_parent_id_idx" ON "_pages_v_blocks_accordion_block_accordions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_block_accordions_locale_idx" ON "_pages_v_blocks_accordion_block_accordions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_block_order_idx" ON "_pages_v_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_block_parent_id_idx" ON "_pages_v_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_block_path_idx" ON "_pages_v_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_block_locale_idx" ON "_pages_v_blocks_accordion_block" USING btree ("_locale");
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_blocks_content_section_size";
  DROP TYPE "public"."enum_pages_blocks_content_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_section_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_2_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_2_relation_to";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_3_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_3_relation_to";
  DROP TYPE "public"."enum_pages_blocks_cta_2_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_2_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_two_block_background_mode";
  DROP TYPE "public"."enum_pages_blocks_two_block_text_color_mode";
  DROP TYPE "public"."enum_pages_blocks_two_block_background_variant";
  DROP TYPE "public"."enum_pages_blocks_card_carousel_block_cards_link_type";
  DROP TYPE "public"."enum_pages_blocks_card_carousel_block_card_type";
  DROP TYPE "public"."enum_pages_blocks_people_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_2_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_2_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_3_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_3_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_two_block_background_mode";
  DROP TYPE "public"."enum__pages_v_blocks_two_block_text_color_mode";
  DROP TYPE "public"."enum__pages_v_blocks_two_block_background_variant";
  DROP TYPE "public"."enum__pages_v_blocks_card_carousel_block_cards_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_card_carousel_block_card_type";
  DROP TYPE "public"."enum__pages_v_blocks_people_archive_populate_by";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_content_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_pages_blocks_archive_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_pages_blocks_two_block_background_mode" AS ENUM('color', 'media');
  CREATE TYPE "public"."enum_pages_blocks_two_block_text_color_mode" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum_pages_blocks_two_block_background_variant" AS ENUM('default', 'accent', 'secondary', 'dark', 'neutral');
  CREATE TYPE "public"."enum_pages_blocks_card_carousel_block_cards_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_card_carousel_block_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum_pages_blocks_people_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_2_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_2_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_3_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_3_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__pages_v_blocks_two_block_background_mode" AS ENUM('color', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_two_block_text_color_mode" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum__pages_v_blocks_two_block_background_variant" AS ENUM('default', 'accent', 'secondary', 'dark', 'neutral');
  CREATE TYPE "public"."enum__pages_v_blocks_card_carousel_block_cards_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_card_carousel_block_card_type" AS ENUM('info', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_people_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_section_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
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
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"centered" boolean DEFAULT false,
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
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
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
  	"centered" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_two_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enable_background" boolean DEFAULT false,
  	"background_mode" "enum_pages_blocks_two_block_background_mode" DEFAULT 'color',
  	"background_media_id" integer,
  	"text_color_mode" "enum_pages_blocks_two_block_text_color_mode" DEFAULT 'white',
  	"background_variant" "enum_pages_blocks_two_block_background_variant" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_carousel_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "enum_pages_blocks_card_carousel_block_cards_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"media_id" integer
  );
  
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
  
  CREATE TABLE "pages_blocks_card_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"card_type" "enum_pages_blocks_card_carousel_block_card_type" DEFAULT 'link',
  	"card_background_color" "bg" DEFAULT '',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_user_login" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_people_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_people_archive_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"enable_pagination" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_promo_strip_usps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_promo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accordion_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"side_by_side_with_intro" boolean DEFAULT false,
  	"single_open" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_section_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_section_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
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
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
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
  	"enable_category_filter" boolean DEFAULT false,
  	"enable_pagination" boolean DEFAULT false,
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
  	"centered" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enable_background" boolean DEFAULT false,
  	"background_mode" "enum__pages_v_blocks_two_block_background_mode" DEFAULT 'color',
  	"background_media_id" integer,
  	"text_color_mode" "enum__pages_v_blocks_two_block_text_color_mode" DEFAULT 'white',
  	"background_variant" "enum__pages_v_blocks_two_block_background_variant" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_carousel_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "enum__pages_v_blocks_card_carousel_block_cards_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"media_id" integer,
  	"_uuid" varchar
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
  
  CREATE TABLE "_pages_v_blocks_card_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"card_type" "enum__pages_v_blocks_card_carousel_block_card_type" DEFAULT 'link',
  	"card_background_color" "bg" DEFAULT '',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_user_login" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_people_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_people_archive_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"enable_pagination" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_strip_usps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"side_by_side_with_intro" boolean DEFAULT false,
  	"single_open" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_archive_block" CASCADE;
  DROP TABLE "pages_blocks_content_block_section" CASCADE;
  DROP TABLE "pages_blocks_content_block" CASCADE;
  DROP TABLE "pages_blocks_archive_block_2" CASCADE;
  DROP TABLE "cta_links" CASCADE;
  DROP TABLE "cta" CASCADE;
  DROP TABLE "pages_blocks_archive_block_3" CASCADE;
  DROP TABLE "cta_2_links" CASCADE;
  DROP TABLE "cta_2" CASCADE;
  DROP TABLE "twoColumn" CASCADE;
  DROP TABLE "cardCarousel_cards" CASCADE;
  DROP TABLE "cardCarousel_info_cards" CASCADE;
  DROP TABLE "cardCarousel" CASCADE;
  DROP TABLE "pages_blocks_user_login_block" CASCADE;
  DROP TABLE "peopleArchive" CASCADE;
  DROP TABLE "pages_blocks_promo_strip_block_usps" CASCADE;
  DROP TABLE "pages_blocks_promo_strip_block" CASCADE;
  DROP TABLE "pages_blocks_accordion_block_accordions" CASCADE;
  DROP TABLE "pages_blocks_accordion_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_block" CASCADE;
  DROP TABLE "_pages_v_blocks_content_block_section" CASCADE;
  DROP TABLE "_pages_v_blocks_content_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_block_2" CASCADE;
  DROP TABLE "_cta_v_links" CASCADE;
  DROP TABLE "_cta_v" CASCADE;
  DROP TABLE "_pages_v_blocks_archive_block_3" CASCADE;
  DROP TABLE "_cta_v_2_links" CASCADE;
  DROP TABLE "_cta_v_2" CASCADE;
  DROP TABLE "_twoColumn_v" CASCADE;
  DROP TABLE "_cardCarousel_v_cards" CASCADE;
  DROP TABLE "_cardCarousel_v_info_cards" CASCADE;
  DROP TABLE "_cardCarousel_v" CASCADE;
  DROP TABLE "_pages_v_blocks_user_login_block" CASCADE;
  DROP TABLE "_peopleArchive_v" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_strip_block_usps" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_strip_block" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_block_accordions" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_block" CASCADE;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_2" ADD CONSTRAINT "pages_blocks_archive_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_3" ADD CONSTRAINT "pages_blocks_archive_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_2_links" ADD CONSTRAINT "pages_blocks_cta_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_2" ADD CONSTRAINT "pages_blocks_cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_block" ADD CONSTRAINT "pages_blocks_two_block_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_block" ADD CONSTRAINT "pages_blocks_two_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ADD CONSTRAINT "pages_blocks_card_carousel_block_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_carousel_block_cards" ADD CONSTRAINT "pages_blocks_card_carousel_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "pages_blocks_card_carousel_block_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "pages_blocks_card_carousel_block_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_carousel_block" ADD CONSTRAINT "pages_blocks_card_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_user_login" ADD CONSTRAINT "pages_blocks_user_login_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_people_archive" ADD CONSTRAINT "pages_blocks_people_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_strip_usps" ADD CONSTRAINT "pages_blocks_promo_strip_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_strip" ADD CONSTRAINT "pages_blocks_promo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_accordions" ADD CONSTRAINT "pages_blocks_accordion_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_2" ADD CONSTRAINT "_pages_v_blocks_archive_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive_3" ADD CONSTRAINT "_pages_v_blocks_archive_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_2_links" ADD CONSTRAINT "_pages_v_blocks_cta_2_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_2" ADD CONSTRAINT "_pages_v_blocks_cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_block" ADD CONSTRAINT "_pages_v_blocks_two_block_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_block" ADD CONSTRAINT "_pages_v_blocks_two_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ADD CONSTRAINT "_pages_v_blocks_card_carousel_block_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_cards" ADD CONSTRAINT "_pages_v_blocks_card_carousel_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "_pages_v_blocks_card_carousel_block_info_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_carousel_block_info_cards" ADD CONSTRAINT "_pages_v_blocks_card_carousel_block_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_carousel_block" ADD CONSTRAINT "_pages_v_blocks_card_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_user_login" ADD CONSTRAINT "_pages_v_blocks_user_login_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_people_archive" ADD CONSTRAINT "_pages_v_blocks_people_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip_usps" ADD CONSTRAINT "_pages_v_blocks_promo_strip_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip" ADD CONSTRAINT "_pages_v_blocks_promo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_accordions" ADD CONSTRAINT "_pages_v_blocks_accordion_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_locale_idx" ON "pages_blocks_archive" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_section_order_idx" ON "pages_blocks_content_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_section_parent_id_idx" ON "pages_blocks_content_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_section_locale_idx" ON "pages_blocks_content_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_locale_idx" ON "pages_blocks_content" USING btree ("_locale");
  CREATE INDEX "pages_blocks_archive_2_order_idx" ON "pages_blocks_archive_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_2_parent_id_idx" ON "pages_blocks_archive_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_2_path_idx" ON "pages_blocks_archive_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_2_locale_idx" ON "pages_blocks_archive_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_links_locale_idx" ON "pages_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_locale_idx" ON "pages_blocks_cta" USING btree ("_locale");
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
  CREATE INDEX "pages_blocks_two_block_order_idx" ON "pages_blocks_two_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_block_parent_id_idx" ON "pages_blocks_two_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_block_path_idx" ON "pages_blocks_two_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_two_block_locale_idx" ON "pages_blocks_two_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_two_block_background_media_idx" ON "pages_blocks_two_block" USING btree ("background_media_id");
  CREATE INDEX "pages_blocks_card_carousel_block_cards_order_idx" ON "pages_blocks_card_carousel_block_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_carousel_block_cards_parent_id_idx" ON "pages_blocks_card_carousel_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_carousel_block_cards_locale_idx" ON "pages_blocks_card_carousel_block_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_carousel_block_cards_media_idx" ON "pages_blocks_card_carousel_block_cards" USING btree ("media_id");
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_order_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_parent_id_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_locale_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_carousel_block_info_cards_media_idx" ON "pages_blocks_card_carousel_block_info_cards" USING btree ("media_id");
  CREATE INDEX "pages_blocks_card_carousel_block_order_idx" ON "pages_blocks_card_carousel_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_carousel_block_parent_id_idx" ON "pages_blocks_card_carousel_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_carousel_block_path_idx" ON "pages_blocks_card_carousel_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_carousel_block_locale_idx" ON "pages_blocks_card_carousel_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_user_login_order_idx" ON "pages_blocks_user_login" USING btree ("_order");
  CREATE INDEX "pages_blocks_user_login_parent_id_idx" ON "pages_blocks_user_login" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_user_login_path_idx" ON "pages_blocks_user_login" USING btree ("_path");
  CREATE INDEX "pages_blocks_user_login_locale_idx" ON "pages_blocks_user_login" USING btree ("_locale");
  CREATE INDEX "pages_blocks_people_archive_order_idx" ON "pages_blocks_people_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_people_archive_parent_id_idx" ON "pages_blocks_people_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_people_archive_path_idx" ON "pages_blocks_people_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_people_archive_locale_idx" ON "pages_blocks_people_archive" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promo_strip_usps_order_idx" ON "pages_blocks_promo_strip_usps" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_strip_usps_parent_id_idx" ON "pages_blocks_promo_strip_usps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_strip_usps_locale_idx" ON "pages_blocks_promo_strip_usps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promo_strip_order_idx" ON "pages_blocks_promo_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_strip_parent_id_idx" ON "pages_blocks_promo_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_strip_path_idx" ON "pages_blocks_promo_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_promo_strip_locale_idx" ON "pages_blocks_promo_strip" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_accordions_order_idx" ON "pages_blocks_accordion_accordions" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_accordions_parent_id_idx" ON "pages_blocks_accordion_accordions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_accordions_locale_idx" ON "pages_blocks_accordion_accordions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_order_idx" ON "pages_blocks_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_parent_id_idx" ON "pages_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_path_idx" ON "pages_blocks_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_locale_idx" ON "pages_blocks_accordion" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_locale_idx" ON "_pages_v_blocks_archive" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_section_order_idx" ON "_pages_v_blocks_content_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_section_parent_id_idx" ON "_pages_v_blocks_content_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_section_locale_idx" ON "_pages_v_blocks_content_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_locale_idx" ON "_pages_v_blocks_content" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_archive_2_order_idx" ON "_pages_v_blocks_archive_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_2_parent_id_idx" ON "_pages_v_blocks_archive_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_2_path_idx" ON "_pages_v_blocks_archive_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_2_locale_idx" ON "_pages_v_blocks_archive_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_locale_idx" ON "_pages_v_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_locale_idx" ON "_pages_v_blocks_cta" USING btree ("_locale");
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
  CREATE INDEX "_pages_v_blocks_two_block_order_idx" ON "_pages_v_blocks_two_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_block_parent_id_idx" ON "_pages_v_blocks_two_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_block_path_idx" ON "_pages_v_blocks_two_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_two_block_locale_idx" ON "_pages_v_blocks_two_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_two_block_background_media_idx" ON "_pages_v_blocks_two_block" USING btree ("background_media_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_cards_order_idx" ON "_pages_v_blocks_card_carousel_block_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_cards_parent_id_idx" ON "_pages_v_blocks_card_carousel_block_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_cards_locale_idx" ON "_pages_v_blocks_card_carousel_block_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_cards_media_idx" ON "_pages_v_blocks_card_carousel_block_cards" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_order_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_parent_id_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_locale_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_info_cards_media_idx" ON "_pages_v_blocks_card_carousel_block_info_cards" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_order_idx" ON "_pages_v_blocks_card_carousel_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_parent_id_idx" ON "_pages_v_blocks_card_carousel_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_path_idx" ON "_pages_v_blocks_card_carousel_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_carousel_block_locale_idx" ON "_pages_v_blocks_card_carousel_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_user_login_order_idx" ON "_pages_v_blocks_user_login" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_user_login_parent_id_idx" ON "_pages_v_blocks_user_login" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_user_login_path_idx" ON "_pages_v_blocks_user_login" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_user_login_locale_idx" ON "_pages_v_blocks_user_login" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_people_archive_order_idx" ON "_pages_v_blocks_people_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_people_archive_parent_id_idx" ON "_pages_v_blocks_people_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_people_archive_path_idx" ON "_pages_v_blocks_people_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_people_archive_locale_idx" ON "_pages_v_blocks_people_archive" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_strip_usps_order_idx" ON "_pages_v_blocks_promo_strip_usps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_strip_usps_parent_id_idx" ON "_pages_v_blocks_promo_strip_usps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_usps_locale_idx" ON "_pages_v_blocks_promo_strip_usps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_strip_order_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_strip_parent_id_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_path_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_promo_strip_locale_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_accordions_order_idx" ON "_pages_v_blocks_accordion_accordions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_accordions_parent_id_idx" ON "_pages_v_blocks_accordion_accordions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_accordions_locale_idx" ON "_pages_v_blocks_accordion_accordions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_order_idx" ON "_pages_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_parent_id_idx" ON "_pages_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_path_idx" ON "_pages_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_locale_idx" ON "_pages_v_blocks_accordion" USING btree ("_locale");
  DROP TYPE "public"."enum_pages_blocks_archive_block_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_block_relation_to";
  DROP TYPE "public"."enum_pages_blocks_content_block_section_size";
  DROP TYPE "public"."enum_pages_blocks_content_block_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_block_section_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_block_2_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_block_2_relation_to";
  DROP TYPE "public"."enum_cta_links_link_type";
  DROP TYPE "public"."enum_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_block_3_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_block_3_relation_to";
  DROP TYPE "public"."enum_cta_2_links_link_type";
  DROP TYPE "public"."enum_cta_2_links_link_appearance";
  DROP TYPE "public"."enum_twoColumn_background_mode";
  DROP TYPE "public"."enum_twoColumn_text_color_mode";
  DROP TYPE "public"."enum_twoColumn_background_variant";
  DROP TYPE "public"."enum_cardCarousel_cards_link_type";
  DROP TYPE "public"."enum_cardCarousel_card_type";
  DROP TYPE "public"."enum_peopleArchive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_content_block_section_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_block_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_block_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_2_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_2_relation_to";
  DROP TYPE "public"."enum__cta_v_links_link_type";
  DROP TYPE "public"."enum__cta_v_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_3_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_block_3_relation_to";
  DROP TYPE "public"."enum__cta_v_2_links_link_type";
  DROP TYPE "public"."enum__cta_v_2_links_link_appearance";
  DROP TYPE "public"."enum__twoColumn_v_background_mode";
  DROP TYPE "public"."enum__twoColumn_v_text_color_mode";
  DROP TYPE "public"."enum__twoColumn_v_background_variant";
  DROP TYPE "public"."enum__cardCarousel_v_cards_link_type";
  DROP TYPE "public"."enum__cardCarousel_v_card_type";
  DROP TYPE "public"."enum__peopleArchive_v_populate_by";`)
}
