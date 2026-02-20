import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_search_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_search_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_search_block" CASCADE;
  DROP TABLE "_pages_v_blocks_search_block" CASCADE;
  ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_hero_search_page_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_locales" DROP CONSTRAINT "_pages_v_locales_version_hero_search_page_id_pages_id_fk";
  
  DROP INDEX "pages_hero_hero_search_page_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_search_page_idx";
  ALTER TABLE "search" ADD COLUMN "searchable_text" varchar;
  CREATE INDEX "search_searchable_text_idx" ON "search" USING btree ("searchable_text");
  ALTER TABLE "pages_locales" DROP COLUMN "hero_search_path_mode";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_search_page_id";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_search_path_mode";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_search_page_id";
  DROP TYPE "public"."enum_pages_hero_search_path_mode";
  DROP TYPE "public"."enum__pages_v_version_hero_search_path_mode";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_search_path_mode" AS ENUM('current', 'select');
  CREATE TYPE "public"."enum__pages_v_version_hero_search_path_mode" AS ENUM('current', 'select');
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
  
  DROP INDEX "search_searchable_text_idx";
  ALTER TABLE "pages_locales" ADD COLUMN "hero_search_path_mode" "enum_pages_hero_search_path_mode" DEFAULT 'current';
  ALTER TABLE "pages_locales" ADD COLUMN "hero_search_page_id" integer;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_search_path_mode" "enum__pages_v_version_hero_search_path_mode" DEFAULT 'current';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_search_page_id" integer;
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
  CREATE INDEX "_pages_v_version_hero_version_hero_search_page_idx" ON "_pages_v_locales" USING btree ("version_hero_search_page_id");
  ALTER TABLE "search" DROP COLUMN "searchable_text";`)
}
