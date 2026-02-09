import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_media_block_image_size" AS ENUM('original', 'thumbnail', 'square', 'small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_pages_blocks_media_block_2_image_size" AS ENUM('original', 'thumbnail', 'square', 'small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_image_size" AS ENUM('original', 'thumbnail', 'square', 'small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_2_image_size" AS ENUM('original', 'thumbnail', 'square', 'small', 'medium', 'large', 'xlarge');
  DROP INDEX "media_sizes_og_sizes_og_filename_idx";
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "image_size" "enum_pages_blocks_media_block_image_size" DEFAULT 'original';
  ALTER TABLE "pages_blocks_media_block_2" ADD COLUMN "image_size" "enum_pages_blocks_media_block_2_image_size" DEFAULT 'original';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "image_size" "enum__pages_v_blocks_media_block_image_size" DEFAULT 'original';
  ALTER TABLE "_pages_v_blocks_media_block_2" ADD COLUMN "image_size" "enum__pages_v_blocks_media_block_2_image_size" DEFAULT 'original';
  ALTER TABLE "media" DROP COLUMN "sizes_og_url";
  ALTER TABLE "media" DROP COLUMN "sizes_og_width";
  ALTER TABLE "media" DROP COLUMN "sizes_og_height";
  ALTER TABLE "media" DROP COLUMN "sizes_og_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filename";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "sizes_og_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filename" varchar;
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "image_size";
  ALTER TABLE "pages_blocks_media_block_2" DROP COLUMN "image_size";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "image_size";
  ALTER TABLE "_pages_v_blocks_media_block_2" DROP COLUMN "image_size";
  DROP TYPE "public"."enum_pages_blocks_media_block_image_size";
  DROP TYPE "public"."enum_pages_blocks_media_block_2_image_size";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_image_size";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_2_image_size";`)
}
