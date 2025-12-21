import { Page } from '@/payload-types'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { TypedLocale } from 'payload'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Insert this into your migration up() after creating locale columns, BEFORE dropping old columns / adding unique constraints

  const translations = {
    slug: {
      home: 'forside',
      about: 'om-os',
      cases: 'projekter',
      'dashboard-spot': 'kontrolpanel-spot',
      'ui-library': 'ui-bibliotek',
    },
    title: {
      home: 'Forside',
      about: 'Om Os',
      cases: 'Projekter',
      'dashboard-spot': 'Kontrolpanel Spot',
      'ui-library': 'UI Bibliotek',
    },
  }

  function translate(page: Page, translations: Record<string, Record<string, string>>) {
    return {
      slug:
        translations.slug && translations.slug[page.slug!]
          ? translations.slug[page.slug!]
          : page.slug,
      title:
        translations.title && translations.title[page.title!]
          ? translations.title[page.title!]
          : page.title,
    }
  }

  /** Ensure slug is unique inside the target locale by querying the pages collection
   *  Returns a unique slug (may append "-1", "-2", ... if needed). */
  async function ensureUniqueSlug(payload: any, locale: string, desiredSlug: string) {
    let slug = desiredSlug
    let idx = 1
    while (true) {
      const found = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
      })
      if (!found || (found.docs && found.docs.length === 0)) return slug
      // collision — append counter
      slug = `${desiredSlug}-${idx++}`
    }
  }

  const pages = await payload.find({ collection: 'pages', limit: 0 }).then((r) => r.docs)

  for (const page of pages) {
    const translated = translate(page, translations)
    for (const locale of ['da', 'en']) {
      try {
        const desiredSlug = locale === 'da' ? translated.slug : page.slug
        const uniqueSlug = await ensureUniqueSlug(payload, locale, desiredSlug || '')
        await payload.update({
          collection: 'pages',
          id: page.id,
          locale: locale as TypedLocale,
          data: {
            // only update fields that are now localized — avoid sending deleted top-level fields
            slug: uniqueSlug,
            title: locale === 'da' ? translated.title : page.title,
          },
        })
      } catch (err) {
        // Log and continue — don't abort the whole migration for one failure
        // (Prefer console.error so the migration log captures this)
        // You can add more robust reporting (e.g., write failures to a table) if desired.

        console.error('Failed to backfill page', page.id, 'locale', locale, err)
      }
    }
  }
  // Migration code
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}
