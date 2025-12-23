import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "footer_locales" (
  	"cvr" varchar,
  	"tel" varchar,
  	"contact" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "footer" DROP COLUMN "cvr";
  ALTER TABLE "footer" DROP COLUMN "tel";
  ALTER TABLE "footer" DROP COLUMN "contact";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer_locales" CASCADE;
  ALTER TABLE "footer" ADD COLUMN "cvr" varchar;
  ALTER TABLE "footer" ADD COLUMN "tel" varchar;
  ALTER TABLE "footer" ADD COLUMN "contact" varchar;`)
}
