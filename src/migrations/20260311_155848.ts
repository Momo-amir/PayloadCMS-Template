import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "customization" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_light_id" integer,
  	"logo_dark_id" integer,
  	"favicon_light_id" integer,
  	"favicon_dark_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "customization_locales" (
  	"home_page_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "branding" CASCADE;
  ALTER TABLE "customization" ADD CONSTRAINT "customization_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customization" ADD CONSTRAINT "customization_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customization" ADD CONSTRAINT "customization_favicon_light_id_media_id_fk" FOREIGN KEY ("favicon_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customization" ADD CONSTRAINT "customization_favicon_dark_id_media_id_fk" FOREIGN KEY ("favicon_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customization_locales" ADD CONSTRAINT "customization_locales_home_page_id_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customization_locales" ADD CONSTRAINT "customization_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customization"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "customization_logo_light_idx" ON "customization" USING btree ("logo_light_id");
  CREATE INDEX "customization_logo_dark_idx" ON "customization" USING btree ("logo_dark_id");
  CREATE INDEX "customization_favicon_light_idx" ON "customization" USING btree ("favicon_light_id");
  CREATE INDEX "customization_favicon_dark_idx" ON "customization" USING btree ("favicon_dark_id");
  CREATE INDEX "customization_home_page_idx" ON "customization_locales" USING btree ("home_page_id","_locale");
  CREATE UNIQUE INDEX "customization_locales_locale_parent_id_unique" ON "customization_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "branding" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_light_id" integer,
  	"logo_dark_id" integer,
  	"favicon_light_id" integer,
  	"favicon_dark_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP TABLE "customization" CASCADE;
  DROP TABLE "customization_locales" CASCADE;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_favicon_light_id_media_id_fk" FOREIGN KEY ("favicon_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_favicon_dark_id_media_id_fk" FOREIGN KEY ("favicon_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "branding_logo_light_idx" ON "branding" USING btree ("logo_light_id");
  CREATE INDEX "branding_logo_dark_idx" ON "branding" USING btree ("logo_dark_id");
  CREATE INDEX "branding_favicon_light_idx" ON "branding" USING btree ("favicon_light_id");
  CREATE INDEX "branding_favicon_dark_idx" ON "branding" USING btree ("favicon_dark_id");`)
}
