import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_accordion_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
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
  
  ALTER TABLE "pages_blocks_accordion_group_accordions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_accordion_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion_group_accordions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion_group" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_accordion_group_accordions" CASCADE;
  DROP TABLE "pages_blocks_accordion_group" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_group_accordions" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_group" CASCADE;
  ALTER TABLE "pages_blocks_accordion" ADD COLUMN "single_open" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_accordion" ADD COLUMN "single_open" boolean DEFAULT false;
  ALTER TABLE "search_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "pages_blocks_accordion_accordions" ADD CONSTRAINT "pages_blocks_accordion_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_accordions" ADD CONSTRAINT "_pages_v_blocks_accordion_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_accordion_accordions_order_idx" ON "pages_blocks_accordion_accordions" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_accordions_parent_id_idx" ON "pages_blocks_accordion_accordions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_accordions_locale_idx" ON "pages_blocks_accordion_accordions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_accordions_order_idx" ON "_pages_v_blocks_accordion_accordions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_accordions_parent_id_idx" ON "_pages_v_blocks_accordion_accordions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_accordions_locale_idx" ON "_pages_v_blocks_accordion_accordions" USING btree ("_locale");
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "search_rels_people_id_idx" ON "search_rels" USING btree ("people_id");
  ALTER TABLE "pages_blocks_accordion" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_accordion" DROP COLUMN "content";
  ALTER TABLE "_pages_v_blocks_accordion" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_accordion" DROP COLUMN "content";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_accordion_group_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_accordion_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"single_open" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_group_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"single_open" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_accordion_accordions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion_accordions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_accordion_accordions" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_accordions" CASCADE;
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_people_fk";
  
  DROP INDEX "search_rels_people_id_idx";
  ALTER TABLE "pages_blocks_accordion" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_accordion" ADD COLUMN "content" jsonb;
  ALTER TABLE "_pages_v_blocks_accordion" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_accordion" ADD COLUMN "content" jsonb;
  ALTER TABLE "pages_blocks_accordion_group_accordions" ADD CONSTRAINT "pages_blocks_accordion_group_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_group" ADD CONSTRAINT "pages_blocks_accordion_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_group_accordions" ADD CONSTRAINT "_pages_v_blocks_accordion_group_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_group" ADD CONSTRAINT "_pages_v_blocks_accordion_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_accordion_group_accordions_order_idx" ON "pages_blocks_accordion_group_accordions" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_group_accordions_parent_id_idx" ON "pages_blocks_accordion_group_accordions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_group_accordions_locale_idx" ON "pages_blocks_accordion_group_accordions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_group_order_idx" ON "pages_blocks_accordion_group" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_group_parent_id_idx" ON "pages_blocks_accordion_group" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_group_path_idx" ON "pages_blocks_accordion_group" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_group_locale_idx" ON "pages_blocks_accordion_group" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_group_accordions_order_idx" ON "_pages_v_blocks_accordion_group_accordions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_group_accordions_parent_id_idx" ON "_pages_v_blocks_accordion_group_accordions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_group_accordions_locale_idx" ON "_pages_v_blocks_accordion_group_accordions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_group_order_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_group_parent_id_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_group_path_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_group_locale_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_locale");
  ALTER TABLE "pages_blocks_accordion" DROP COLUMN "single_open";
  ALTER TABLE "_pages_v_blocks_accordion" DROP COLUMN "single_open";
  ALTER TABLE "search_rels" DROP COLUMN "people_id";`)
}
