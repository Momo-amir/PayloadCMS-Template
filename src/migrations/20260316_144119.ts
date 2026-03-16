import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "customization" ADD COLUMN "posts_page_id" integer;
  ALTER TABLE "customization" ADD CONSTRAINT "customization_posts_page_id_pages_id_fk" FOREIGN KEY ("posts_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "customization_posts_page_idx" ON "customization" USING btree ("posts_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "customization" DROP CONSTRAINT "customization_posts_page_id_pages_id_fk";
  
  DROP INDEX "customization_posts_page_idx";
  ALTER TABLE "customization" DROP COLUMN "posts_page_id";`)
}
