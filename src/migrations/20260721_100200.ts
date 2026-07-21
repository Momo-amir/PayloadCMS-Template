import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_mediaGallery_images_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_mediaGallery_images_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum_mediaGallery_images_type" AS ENUM('media', 'text');
  CREATE TYPE "public"."enum__mediaGallery_v_images_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__mediaGallery_v_images_links_link_appearance" AS ENUM('default', 'outline', 'link', 'secondary', 'tertiary');
  CREATE TYPE "public"."enum__mediaGallery_v_images_type" AS ENUM('media', 'text');
  CREATE TABLE "mediaGallery_images_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_mediaGallery_images_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_mediaGallery_images_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_mediaGallery_v_images_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__mediaGallery_v_images_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__mediaGallery_v_images_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  ALTER TABLE "mediaGallery_images" ADD COLUMN "type" "enum_mediaGallery_images_type" DEFAULT 'media';
  ALTER TABLE "mediaGallery_images" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "_mediaGallery_v_images" ADD COLUMN "type" "enum__mediaGallery_v_images_type" DEFAULT 'media';
  ALTER TABLE "_mediaGallery_v_images" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "mediaGallery_images_links" ADD CONSTRAINT "mediaGallery_images_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mediaGallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_mediaGallery_v_images_links" ADD CONSTRAINT "_mediaGallery_v_images_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_mediaGallery_v_images"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "mediaGallery_images_links_order_idx" ON "mediaGallery_images_links" USING btree ("_order");
  CREATE INDEX "mediaGallery_images_links_parent_id_idx" ON "mediaGallery_images_links" USING btree ("_parent_id");
  CREATE INDEX "mediaGallery_images_links_locale_idx" ON "mediaGallery_images_links" USING btree ("_locale");
  CREATE INDEX "_mediaGallery_v_images_links_order_idx" ON "_mediaGallery_v_images_links" USING btree ("_order");
  CREATE INDEX "_mediaGallery_v_images_links_parent_id_idx" ON "_mediaGallery_v_images_links" USING btree ("_parent_id");
  CREATE INDEX "_mediaGallery_v_images_links_locale_idx" ON "_mediaGallery_v_images_links" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "mediaGallery_images_links" CASCADE;
  DROP TABLE "_mediaGallery_v_images_links" CASCADE;
  ALTER TABLE "mediaGallery_images" DROP COLUMN "type";
  ALTER TABLE "mediaGallery_images" DROP COLUMN "rich_text";
  ALTER TABLE "_mediaGallery_v_images" DROP COLUMN "type";
  ALTER TABLE "_mediaGallery_v_images" DROP COLUMN "rich_text";
  DROP TYPE "public"."enum_mediaGallery_images_links_link_type";
  DROP TYPE "public"."enum_mediaGallery_images_links_link_appearance";
  DROP TYPE "public"."enum_mediaGallery_images_type";
  DROP TYPE "public"."enum__mediaGallery_v_images_links_link_type";
  DROP TYPE "public"."enum__mediaGallery_v_images_links_link_appearance";
  DROP TYPE "public"."enum__mediaGallery_v_images_type";`)
}
