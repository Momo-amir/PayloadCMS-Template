import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_card_block_card_background_color" ADD VALUE 'neutral';
  ALTER TYPE "public"."enum__pages_v_blocks_card_block_card_background_color" ADD VALUE 'neutral';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_block" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_card_block_card_background_color";
  CREATE TYPE "public"."enum_pages_blocks_card_block_card_background_color" AS ENUM('', 'dark', 'accent', 'accentThree', 'secondary');
  ALTER TABLE "pages_blocks_card_block" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."enum_pages_blocks_card_block_card_background_color" USING "card_background_color"::"public"."enum_pages_blocks_card_block_card_background_color";
  ALTER TABLE "_pages_v_blocks_card_block" ALTER COLUMN "card_background_color" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_card_block_card_background_color";
  CREATE TYPE "public"."enum__pages_v_blocks_card_block_card_background_color" AS ENUM('', 'dark', 'accent', 'accentThree', 'secondary');
  ALTER TABLE "_pages_v_blocks_card_block" ALTER COLUMN "card_background_color" SET DATA TYPE "public"."enum__pages_v_blocks_card_block_card_background_color" USING "card_background_color"::"public"."enum__pages_v_blocks_card_block_card_background_color";`)
}
