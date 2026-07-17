import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_login_config_extra_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_login_config_extra_links_link_appearance" AS ENUM('default', 'outline', 'link');
  ALTER TYPE "public"."enum_users_roles" ADD VALUE 'customer';
  CREATE TABLE "login_config_extra_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_login_config_extra_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_login_config_extra_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "login_config_extra_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "login_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_create_account" boolean DEFAULT true,
  	"show_forgot_password" boolean DEFAULT true,
  	"require_consent" boolean DEFAULT false,
  	"consent_link" varchar DEFAULT '/privacy-policy',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "login_config_locales" (
  	"title" varchar DEFAULT 'Log in',
  	"intro" varchar,
  	"submit_label" varchar DEFAULT 'Continue',
  	"logout_label" varchar DEFAULT 'Log out',
  	"create_account_label" varchar DEFAULT 'Create an account',
  	"forgot_password_label" varchar DEFAULT 'Forgot your password?',
  	"create_title" varchar DEFAULT 'Create an account',
  	"create_intro" varchar,
  	"create_submit_label" varchar DEFAULT 'Create Account',
  	"forgot_title" varchar DEFAULT 'Forgot Password',
  	"forgot_intro" varchar DEFAULT 'Please enter your email below. You will receive an email with instructions on how to reset your password.',
  	"forgot_submit_label" varchar DEFAULT 'Reset Password',
  	"forgot_success_title" varchar DEFAULT 'Request submitted',
  	"forgot_success_message" varchar DEFAULT 'Check your email for a link that will allow you to securely reset your password.',
  	"name_label" varchar DEFAULT 'Name',
  	"email_label" varchar DEFAULT 'Email',
  	"password_label" varchar DEFAULT 'Password',
  	"password_confirm_label" varchar DEFAULT 'Confirm password',
  	"consent_label" varchar DEFAULT 'I agree to the',
  	"consent_link_label" varchar DEFAULT 'privacy policy',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "login_config_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  ALTER TABLE "customization" ADD COLUMN "login_page_id" integer;
  ALTER TABLE "login_config_extra_links" ADD CONSTRAINT "login_config_extra_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."login_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "login_config_extra_links_locales" ADD CONSTRAINT "login_config_extra_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."login_config_extra_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "login_config_locales" ADD CONSTRAINT "login_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."login_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "login_config_rels" ADD CONSTRAINT "login_config_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."login_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "login_config_rels" ADD CONSTRAINT "login_config_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "login_config_rels" ADD CONSTRAINT "login_config_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "login_config_extra_links_order_idx" ON "login_config_extra_links" USING btree ("_order");
  CREATE INDEX "login_config_extra_links_parent_id_idx" ON "login_config_extra_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "login_config_extra_links_locales_locale_parent_id_unique" ON "login_config_extra_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "login_config_locales_locale_parent_id_unique" ON "login_config_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "login_config_rels_order_idx" ON "login_config_rels" USING btree ("order");
  CREATE INDEX "login_config_rels_parent_idx" ON "login_config_rels" USING btree ("parent_id");
  CREATE INDEX "login_config_rels_path_idx" ON "login_config_rels" USING btree ("path");
  CREATE INDEX "login_config_rels_pages_id_idx" ON "login_config_rels" USING btree ("pages_id");
  CREATE INDEX "login_config_rels_posts_id_idx" ON "login_config_rels" USING btree ("posts_id");
  ALTER TABLE "customization" ADD CONSTRAINT "customization_login_page_id_pages_id_fk" FOREIGN KEY ("login_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "customization_login_page_idx" ON "customization" USING btree ("login_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "login_config_extra_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "login_config_extra_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "login_config" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "login_config_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "login_config_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "login_config_extra_links" CASCADE;
  DROP TABLE "login_config_extra_links_locales" CASCADE;
  DROP TABLE "login_config" CASCADE;
  DROP TABLE "login_config_locales" CASCADE;
  DROP TABLE "login_config_rels" CASCADE;
  ALTER TABLE "customization" DROP CONSTRAINT "customization_login_page_id_pages_id_fk";
  
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'user');
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_roles" USING "value"::"public"."enum_users_roles";
  DROP INDEX "customization_login_page_idx";
  ALTER TABLE "customization" DROP COLUMN "login_page_id";
  DROP TYPE "public"."enum_login_config_extra_links_link_type";
  DROP TYPE "public"."enum_login_config_extra_links_link_appearance";`)
}
