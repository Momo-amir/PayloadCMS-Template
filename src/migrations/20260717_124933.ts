import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_account_details_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_account_details_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "customization" ADD COLUMN "account_page_id" integer;
  ALTER TABLE "login_config_locales" ADD COLUMN "account_title" varchar DEFAULT 'Your account';
  ALTER TABLE "login_config_locales" ADD COLUMN "account_intro" varchar;
  ALTER TABLE "login_config_locales" ADD COLUMN "profile_section_label" varchar DEFAULT 'Profile';
  ALTER TABLE "login_config_locales" ADD COLUMN "profile_submit_label" varchar DEFAULT 'Save changes';
  ALTER TABLE "login_config_locales" ADD COLUMN "profile_success_message" varchar DEFAULT 'Profile updated.';
  ALTER TABLE "login_config_locales" ADD COLUMN "password_section_label" varchar DEFAULT 'Change password';
  ALTER TABLE "login_config_locales" ADD COLUMN "password_submit_label" varchar DEFAULT 'Update password';
  ALTER TABLE "login_config_locales" ADD COLUMN "current_password_label" varchar DEFAULT 'Current password';
  ALTER TABLE "login_config_locales" ADD COLUMN "new_password_label" varchar DEFAULT 'New password';
  ALTER TABLE "login_config_locales" ADD COLUMN "password_success_message" varchar DEFAULT 'Password updated.';
  ALTER TABLE "login_config_locales" ADD COLUMN "logged_out_message" varchar DEFAULT 'You need to sign in to view your account.';
  ALTER TABLE "login_config_locales" ADD COLUMN "sign_in_label" varchar DEFAULT 'Sign in';
  ALTER TABLE "pages_blocks_account_details_block" ADD CONSTRAINT "pages_blocks_account_details_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_account_details_block" ADD CONSTRAINT "_pages_v_blocks_account_details_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_account_details_block_order_idx" ON "pages_blocks_account_details_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_account_details_block_parent_id_idx" ON "pages_blocks_account_details_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_account_details_block_path_idx" ON "pages_blocks_account_details_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_account_details_block_locale_idx" ON "pages_blocks_account_details_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_account_details_block_order_idx" ON "_pages_v_blocks_account_details_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_account_details_block_parent_id_idx" ON "_pages_v_blocks_account_details_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_account_details_block_path_idx" ON "_pages_v_blocks_account_details_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_account_details_block_locale_idx" ON "_pages_v_blocks_account_details_block" USING btree ("_locale");
  ALTER TABLE "customization" ADD CONSTRAINT "customization_account_page_id_pages_id_fk" FOREIGN KEY ("account_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "customization_account_page_idx" ON "customization" USING btree ("account_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_account_details_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_account_details_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_account_details_block" CASCADE;
  DROP TABLE "_pages_v_blocks_account_details_block" CASCADE;
  ALTER TABLE "customization" DROP CONSTRAINT "customization_account_page_id_pages_id_fk";
  
  DROP INDEX "customization_account_page_idx";
  ALTER TABLE "customization" DROP COLUMN "account_page_id";
  ALTER TABLE "login_config_locales" DROP COLUMN "account_title";
  ALTER TABLE "login_config_locales" DROP COLUMN "account_intro";
  ALTER TABLE "login_config_locales" DROP COLUMN "profile_section_label";
  ALTER TABLE "login_config_locales" DROP COLUMN "profile_submit_label";
  ALTER TABLE "login_config_locales" DROP COLUMN "profile_success_message";
  ALTER TABLE "login_config_locales" DROP COLUMN "password_section_label";
  ALTER TABLE "login_config_locales" DROP COLUMN "password_submit_label";
  ALTER TABLE "login_config_locales" DROP COLUMN "current_password_label";
  ALTER TABLE "login_config_locales" DROP COLUMN "new_password_label";
  ALTER TABLE "login_config_locales" DROP COLUMN "password_success_message";
  ALTER TABLE "login_config_locales" DROP COLUMN "logged_out_message";
  ALTER TABLE "login_config_locales" DROP COLUMN "sign_in_label";`)
}
