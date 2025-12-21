import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * WARNING: destructive migration
 * This migration will TRUNCATE all public tables except `media` and the payload migrations tables.
 * It will also reset sequences. It's intended for staging to get a clean slate while preserving media.
 * Confirm you have a backup before applying.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Truncate all tables except media and payload migrations tables
  await db.execute(sql`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT IN ('media', 'payload_migrations', 'payload_migrations_lock') LOOP
        RAISE NOTICE 'Truncating table %', r.tablename;
        EXECUTE format('TRUNCATE TABLE public.%I CASCADE', r.tablename);
      END LOOP;
    END$$;
  `)

  // Reset all sequences in public schema
  await db.execute(sql`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP
        RAISE NOTICE 'Resetting sequence %', r.sequence_name;
        EXECUTE format('ALTER SEQUENCE public.%I RESTART WITH 1', r.sequence_name);
      END LOOP;
    END$$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op: cannot restore truncated data via migration
}
