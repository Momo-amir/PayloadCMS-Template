import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_people_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_people_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TABLE "pages_blocks_people_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_people_archive_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_people_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_people_archive_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"image_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_users_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_users_fk";
  
  DROP INDEX "posts_rels_users_id_idx";
  DROP INDEX "_posts_v_rels_users_id_idx";
  ALTER TABLE "pages_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "pages_blocks_people_archive" ADD CONSTRAINT "pages_blocks_people_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_people_archive" ADD CONSTRAINT "_pages_v_blocks_people_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_people_archive_order_idx" ON "pages_blocks_people_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_people_archive_parent_id_idx" ON "pages_blocks_people_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_people_archive_path_idx" ON "pages_blocks_people_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_people_archive_order_idx" ON "_pages_v_blocks_people_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_people_archive_parent_id_idx" ON "_pages_v_blocks_people_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_people_archive_path_idx" ON "_pages_v_blocks_people_archive" USING btree ("_path");
  CREATE INDEX "people_image_idx" ON "people" USING btree ("image_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_people_id_idx" ON "pages_rels" USING btree ("people_id");
  CREATE INDEX "_pages_v_rels_people_id_idx" ON "_pages_v_rels" USING btree ("people_id");
  CREATE INDEX "posts_rels_people_id_idx" ON "posts_rels" USING btree ("people_id");
  CREATE INDEX "_posts_v_rels_people_id_idx" ON "_posts_v_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  ALTER TABLE "posts_rels" DROP COLUMN "users_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "users_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_people_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_people_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_people_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_people_archive" CASCADE;
  DROP TABLE "people" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_people_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_people_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_people_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_people_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_people_fk";
  
  DROP INDEX "pages_rels_people_id_idx";
  DROP INDEX "_pages_v_rels_people_id_idx";
  DROP INDEX "posts_rels_people_id_idx";
  DROP INDEX "_posts_v_rels_people_id_idx";
  DROP INDEX "payload_locked_documents_rels_people_id_idx";
  ALTER TABLE "posts_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  ALTER TABLE "pages_rels" DROP COLUMN "people_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "people_id";
  ALTER TABLE "posts_rels" DROP COLUMN "people_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "people_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "people_id";
  DROP TYPE "public"."enum_pages_blocks_people_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_people_archive_populate_by";`)
}
