import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { unstable_cache } from 'next/cache'
import { getCustomization, getHomePageID } from '@/cms/utilities/customization'

export const dynamic = 'force-dynamic'

const getPagesSitemap = unstable_cache(
  async (locale: 'da' | 'en' | 'all' | undefined): Promise<ISitemapField[]> => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'pages',
      locale,
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()
    const customization = await getCustomization(locale === 'all' ? undefined : locale)()
    const homePageId = getHomePageID(customization)

    const defaultSitemap = [
      {
        loc: locale && locale !== 'da' ? `${SITE_URL}/${locale}/search` : `${SITE_URL}/search`,
        lastmod: dateFallback,
      },
      {
        loc: locale && locale !== 'da' ? `${SITE_URL}/${locale}/posts` : `${SITE_URL}/posts`,
        lastmod: dateFallback,
      },
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            const loc =
              homePageId !== null && String(page.id) === String(homePageId)
                ? locale && locale !== 'da'
                  ? `${SITE_URL}/${locale}/`
                  : `${SITE_URL}/`
                : locale && locale !== 'da'
                  ? `${SITE_URL}/${locale}/${page?.slug}`
                  : `${SITE_URL}/${page?.slug}`
            return {
              loc,
              lastmod: page.updatedAt?.toString() || dateFallback,
            }
          })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET(_req: Request, { params }: { params: Promise<{ locale?: string }> }) {
  const resolvedParams = await params
  const locale = (resolvedParams?.locale as 'da' | 'en' | 'all' | undefined) || 'da'
  const sitemap = await getPagesSitemap(locale)

  return getServerSideSitemap(sitemap)
}
