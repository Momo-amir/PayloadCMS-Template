import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_search_path_mode" AS ENUM('current', 'select');
  CREATE TYPE "public"."enum_pages_hero_result_collection" AS ENUM('posts', 'people');
  CREATE TYPE "public"."enum__pages_v_version_hero_search_path_mode" AS ENUM('current', 'select');
  CREATE TYPE "public"."enum__pages_v_version_hero_result_collection" AS ENUM('posts', 'people');
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'search';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'search';
  CREATE TABLE "pages_blocks_search_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"search_page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_search_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"search_page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_locales" ADD COLUMN "hero_search_path_mode" "enum_pages_hero_search_path_mode" DEFAULT 'current';
  ALTER TABLE "pages_locales" ADD COLUMN "hero_search_page_id" integer;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_results_per_page" numeric DEFAULT 12;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_result_collection" "enum_pages_hero_result_collection" DEFAULT 'posts';
  ALTER TABLE "pages_locales" ADD COLUMN "hero_empty_text" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_search_path_mode" "enum__pages_v_version_hero_search_path_mode" DEFAULT 'current';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_search_page_id" integer;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_results_per_page" numeric DEFAULT 12;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_result_collection" "enum__pages_v_version_hero_result_collection" DEFAULT 'posts';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_empty_text" varchar;
  ALTER TABLE "pages_blocks_search_block" ADD CONSTRAINT "pages_blocks_search_block_search_page_id_pages_id_fk" FOREIGN KEY ("search_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_search_block" ADD CONSTRAINT "pages_blocks_search_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_search_block" ADD CONSTRAINT "_pages_v_blocks_search_block_search_page_id_pages_id_fk" FOREIGN KEY ("search_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_search_block" ADD CONSTRAINT "_pages_v_blocks_search_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_search_block_order_idx" ON "pages_blocks_search_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_search_block_parent_id_idx" ON "pages_blocks_search_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_search_block_path_idx" ON "pages_blocks_search_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_search_block_locale_idx" ON "pages_blocks_search_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_search_block_search_page_idx" ON "pages_blocks_search_block" USING btree ("search_page_id");
  CREATE INDEX "_pages_v_blocks_search_block_order_idx" ON "_pages_v_blocks_search_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_search_block_parent_id_idx" ON "_pages_v_blocks_search_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_search_block_path_idx" ON "_pages_v_blocks_search_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_search_block_locale_idx" ON "_pages_v_blocks_search_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_search_block_search_page_idx" ON "_pages_v_blocks_search_block" USING btree ("search_page_id");
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_search_page_id_pages_id_fk" FOREIGN KEY ("hero_search_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_search_page_id_pages_id_fk" FOREIGN KEY ("version_hero_search_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_search_page_idx" ON "pages_locales" USING btree ("hero_search_page_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_search_page_idx" ON "_pages_v_locales" USING btree ("version_hero_search_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_search_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_search_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_search_block" CASCADE;
  DROP TABLE "_pages_v_blocks_search_block" CASCADE;
  ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_hero_search_page_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_locales" DROP CONSTRAINT "_pages_v_locales_version_hero_search_page_id_pages_id_fk";
  
  ALTER TABLE "pages_locales" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages_locales" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages_locales" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages_locales" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_hero_hero_search_page_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_search_page_idx";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_search_path_mode";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_search_page_id";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_results_per_page";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_result_collection";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_empty_text";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_search_path_mode";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_search_page_id";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_results_per_page";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_result_collection";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_empty_text";
  DROP TYPE "public"."enum_pages_hero_search_path_mode";
  DROP TYPE "public"."enum_pages_hero_result_collection";
  DROP TYPE "public"."enum__pages_v_version_hero_search_path_mode";
  DROP TYPE "public"."enum__pages_v_version_hero_result_collection";`)
}
