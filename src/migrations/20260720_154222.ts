import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_embed_block_2_embed_type" AS ENUM('html');
  CREATE TYPE "public"."enum_pages_blocks_embed_block_2_max_width" AS ENUM('contained', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_embed_block_2_embed_type" AS ENUM('html');
  CREATE TYPE "public"."enum__pages_v_blocks_embed_block_2_max_width" AS ENUM('contained', 'full');
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
  
  ALTER TABLE "pages_blocks_embed_block_2" ADD CONSTRAINT "pages_blocks_embed_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_embed_block_2" ADD CONSTRAINT "_pages_v_blocks_embed_block_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_embed_block_2_order_idx" ON "pages_blocks_embed_block_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_embed_block_2_parent_id_idx" ON "pages_blocks_embed_block_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_embed_block_2_path_idx" ON "pages_blocks_embed_block_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_embed_block_2_locale_idx" ON "pages_blocks_embed_block_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_embed_block_2_order_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_embed_block_2_parent_id_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_embed_block_2_path_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_embed_block_2_locale_idx" ON "_pages_v_blocks_embed_block_2" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_embed_block_2" CASCADE;
  DROP TABLE "_pages_v_blocks_embed_block_2" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_embed_block_2_embed_type";
  DROP TYPE "public"."enum_pages_blocks_embed_block_2_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_embed_block_2_embed_type";
  DROP TYPE "public"."enum__pages_v_blocks_embed_block_2_max_width";`)
}
