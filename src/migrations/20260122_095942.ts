import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_content_2_section" CASCADE;
  DROP TABLE "pages_blocks_content_2" CASCADE;
  DROP TABLE "pages_blocks_content_3_section" CASCADE;
  DROP TABLE "pages_blocks_content_3" CASCADE;
  DROP TABLE "_pages_v_blocks_content_2_section" CASCADE;
  DROP TABLE "_pages_v_blocks_content_2" CASCADE;
  DROP TABLE "_pages_v_blocks_content_3_section" CASCADE;
  DROP TABLE "_pages_v_blocks_content_3" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_content_2_section_size";
  DROP TYPE "public"."enum_pages_blocks_content_2_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_2_section_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_3_section_size";
  DROP TYPE "public"."enum_pages_blocks_content_3_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_3_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_2_section_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_2_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_2_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_3_section_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_3_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_3_section_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_2_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_2_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_2_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_3_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_3_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_3_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_2_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_2_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_2_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_3_section_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_3_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_3_section_link_appearance" AS ENUM('default', 'outline');
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
  
  ALTER TABLE "pages_blocks_content_2_section" ADD CONSTRAINT "pages_blocks_content_2_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_2" ADD CONSTRAINT "pages_blocks_content_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_3_section" ADD CONSTRAINT "pages_blocks_content_3_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_3" ADD CONSTRAINT "pages_blocks_content_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_2_section" ADD CONSTRAINT "_pages_v_blocks_content_2_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_2" ADD CONSTRAINT "_pages_v_blocks_content_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_3_section" ADD CONSTRAINT "_pages_v_blocks_content_3_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_3" ADD CONSTRAINT "_pages_v_blocks_content_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_2_section_order_idx" ON "pages_blocks_content_2_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_2_section_parent_id_idx" ON "pages_blocks_content_2_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_2_section_locale_idx" ON "pages_blocks_content_2_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_2_order_idx" ON "pages_blocks_content_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_2_parent_id_idx" ON "pages_blocks_content_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_2_path_idx" ON "pages_blocks_content_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_2_locale_idx" ON "pages_blocks_content_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_3_section_order_idx" ON "pages_blocks_content_3_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_3_section_parent_id_idx" ON "pages_blocks_content_3_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_3_section_locale_idx" ON "pages_blocks_content_3_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_3_order_idx" ON "pages_blocks_content_3" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_3_parent_id_idx" ON "pages_blocks_content_3" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_3_path_idx" ON "pages_blocks_content_3" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_3_locale_idx" ON "pages_blocks_content_3" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_2_section_order_idx" ON "_pages_v_blocks_content_2_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_2_section_parent_id_idx" ON "_pages_v_blocks_content_2_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_2_section_locale_idx" ON "_pages_v_blocks_content_2_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_2_order_idx" ON "_pages_v_blocks_content_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_2_parent_id_idx" ON "_pages_v_blocks_content_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_2_path_idx" ON "_pages_v_blocks_content_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_2_locale_idx" ON "_pages_v_blocks_content_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_3_section_order_idx" ON "_pages_v_blocks_content_3_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_3_section_parent_id_idx" ON "_pages_v_blocks_content_3_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_3_section_locale_idx" ON "_pages_v_blocks_content_3_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_3_order_idx" ON "_pages_v_blocks_content_3" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_3_parent_id_idx" ON "_pages_v_blocks_content_3" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_3_path_idx" ON "_pages_v_blocks_content_3" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_3_locale_idx" ON "_pages_v_blocks_content_3" USING btree ("_locale");`)
}
