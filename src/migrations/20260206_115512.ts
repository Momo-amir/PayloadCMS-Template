import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "pages_blocks_promo_strip_usps" ADD CONSTRAINT "pages_blocks_promo_strip_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_strip" ADD CONSTRAINT "pages_blocks_promo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip_usps" ADD CONSTRAINT "_pages_v_blocks_promo_strip_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_strip" ADD CONSTRAINT "_pages_v_blocks_promo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_promo_strip_usps_order_idx" ON "pages_blocks_promo_strip_usps" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_strip_usps_parent_id_idx" ON "pages_blocks_promo_strip_usps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_strip_usps_locale_idx" ON "pages_blocks_promo_strip_usps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promo_strip_order_idx" ON "pages_blocks_promo_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_strip_parent_id_idx" ON "pages_blocks_promo_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_strip_path_idx" ON "pages_blocks_promo_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_promo_strip_locale_idx" ON "pages_blocks_promo_strip" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_strip_usps_order_idx" ON "_pages_v_blocks_promo_strip_usps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_strip_usps_parent_id_idx" ON "_pages_v_blocks_promo_strip_usps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_usps_locale_idx" ON "_pages_v_blocks_promo_strip_usps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_strip_order_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_strip_parent_id_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_strip_path_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_promo_strip_locale_idx" ON "_pages_v_blocks_promo_strip" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_promo_strip_usps" CASCADE;
  DROP TABLE "pages_blocks_promo_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_strip_usps" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_strip" CASCADE;`)
}
