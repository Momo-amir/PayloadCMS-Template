import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "_pages_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
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
  
  ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_group_accordions" ADD CONSTRAINT "pages_blocks_accordion_group_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_group" ADD CONSTRAINT "pages_blocks_accordion_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_group_accordions" ADD CONSTRAINT "_pages_v_blocks_accordion_group_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_group" ADD CONSTRAINT "_pages_v_blocks_accordion_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_accordion_order_idx" ON "pages_blocks_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_parent_id_idx" ON "pages_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_path_idx" ON "pages_blocks_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_locale_idx" ON "pages_blocks_accordion" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_group_accordions_order_idx" ON "pages_blocks_accordion_group_accordions" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_group_accordions_parent_id_idx" ON "pages_blocks_accordion_group_accordions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_group_accordions_locale_idx" ON "pages_blocks_accordion_group_accordions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_group_order_idx" ON "pages_blocks_accordion_group" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_group_parent_id_idx" ON "pages_blocks_accordion_group" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_group_path_idx" ON "pages_blocks_accordion_group" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_group_locale_idx" ON "pages_blocks_accordion_group" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_order_idx" ON "_pages_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_parent_id_idx" ON "_pages_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_path_idx" ON "_pages_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_locale_idx" ON "_pages_v_blocks_accordion" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_group_accordions_order_idx" ON "_pages_v_blocks_accordion_group_accordions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_group_accordions_parent_id_idx" ON "_pages_v_blocks_accordion_group_accordions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_group_accordions_locale_idx" ON "_pages_v_blocks_accordion_group_accordions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_group_order_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_group_parent_id_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_group_path_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_group_locale_idx" ON "_pages_v_blocks_accordion_group" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_accordion" CASCADE;
  DROP TABLE "pages_blocks_accordion_group_accordions" CASCADE;
  DROP TABLE "pages_blocks_accordion_group" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_group_accordions" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_group" CASCADE;`)
}
