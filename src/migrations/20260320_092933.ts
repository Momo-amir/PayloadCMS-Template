import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_children_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_type" AS ENUM('link', 'dropdown');
  CREATE TABLE "header_nav_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_children_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_children_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "header_nav_items_locales" ALTER COLUMN "link_label" DROP NOT NULL;
  ALTER TABLE "header_nav_items" ADD COLUMN "type" "enum_header_nav_items_type" DEFAULT 'link';
  ALTER TABLE "header_nav_items_locales" ADD COLUMN "dropdown_label" varchar;
  ALTER TABLE "header_nav_items_children" ADD CONSTRAINT "header_nav_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_children_locales" ADD CONSTRAINT "header_nav_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_children"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_children_order_idx" ON "header_nav_items_children" USING btree ("_order");
  CREATE INDEX "header_nav_items_children_parent_id_idx" ON "header_nav_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_children_locales_locale_parent_id_unique" ON "header_nav_items_children_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_nav_items_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_children_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_nav_items_children" CASCADE;
  DROP TABLE "header_nav_items_children_locales" CASCADE;
  ALTER TABLE "header_nav_items_locales" ALTER COLUMN "link_label" SET NOT NULL;
  ALTER TABLE "header_nav_items" DROP COLUMN "type";
  ALTER TABLE "header_nav_items_locales" DROP COLUMN "dropdown_label";
  DROP TYPE "public"."enum_header_nav_items_children_link_type";
  DROP TYPE "public"."enum_header_nav_items_type";`)
}
