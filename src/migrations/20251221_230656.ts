import { Page } from '@/payload-types'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { TypedLocale } from 'payload'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Destructive fallback migration: truncate pages/posts locale tables and seed minimal pages
  // (Backups strongly recommended before running this in production.)

  // If backfilling existing locale data isn't reliable in your environment, and you
  // are OK with wiping page/post content to ensure the server runs cleanly, we take
  // a destructive-but-safe approach here: truncate pages/posts tables and seed a
  // minimal homepage per locale so the site has something to render.

  // WARNING: destructive operation — backups recommended for staging/production.
  await db.execute(sql`
    TRUNCATE TABLE pages_locales, _pages_v_locales, pages, _pages_v, posts_locales, _posts_v_locales, posts, _posts_v RESTART IDENTITY CASCADE;
  `)

  const locales = ['da', 'en']

  for (const locale of locales) {
    try {
      // minimal page
      const slug = locale === 'da' ? 'forside' : 'home'
      const title = locale === 'da' ? 'Forside' : 'Home'

      await payload.create({
        collection: 'pages',
        locale: locale as TypedLocale,
        data: {
          title,
          slug,
          // minimal layout — provide empty content; Payload should accept empty blocks for now
          layout: [],
        },
        draft: true,
        overrideAccess: true,
      })

      // Update header and footer globals to include a localized home link (custom URL)
      try {
        await payload.updateGlobal?.({
          slug: 'header',
          data: {
            navItems: [
              {
                link: {
                  type: 'custom',
                  url: locale === 'da' ? '/' : '/en/',
                  label: locale === 'da' ? 'Forside' : 'Home',
                },
              },
            ],
          },
          locale: locale as TypedLocale,
        })

        await payload.updateGlobal?.({
          slug: 'footer',
          data: {
            navItems: [
              {
                link: {
                  type: 'custom',
                  url: locale === 'da' ? '/' : '/en/',
                  label: locale === 'da' ? 'Forside' : 'Home',
                },
              },
            ],
          },
          locale: locale as TypedLocale,
        })
      } catch (err) {
        // If updateGlobal isn't available or fails, log and continue — admins can seed via UI

        console.warn('Could not update header/footer globals automatically', err)
      }
    } catch (err) {
      console.error('Failed to seed minimal page for locale', locale, err)
    }
  }

  // Migration code
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op down migration for destructive reset. Restore from backups if needed.
}
