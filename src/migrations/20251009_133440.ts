import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_cta_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum_pages_blocks_cta_links_link_appearance" ADD VALUE 'tertiary';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" ADD VALUE 'tertiary';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline', 'link');
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_blocks_cta_links_link_appearance";
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_blocks_cta_links_link_appearance" USING "link_appearance"::"public"."enum_pages_blocks_cta_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline', 'link');
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_cta_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_blocks_cta_links_link_appearance";`)
}
