import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_blocks_phone" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'phone' NOT NULL,
  	"width" numeric,
  	"required" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_phone_locales" (
  	"label" varchar DEFAULT 'Phone number',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "forms_blocks_phone" ADD CONSTRAINT "forms_blocks_phone_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_phone_locales" ADD CONSTRAINT "forms_blocks_phone_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_phone"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_blocks_phone_order_idx" ON "forms_blocks_phone" USING btree ("_order");
  CREATE INDEX "forms_blocks_phone_parent_id_idx" ON "forms_blocks_phone" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_phone_path_idx" ON "forms_blocks_phone" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_phone_locales_locale_parent_id_unique" ON "forms_blocks_phone_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "forms_blocks_phone" CASCADE;
  DROP TABLE "forms_blocks_phone_locales" CASCADE;`)
}
