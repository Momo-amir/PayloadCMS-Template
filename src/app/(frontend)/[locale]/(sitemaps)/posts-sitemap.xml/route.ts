import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-dynamic'

const getPostsSitemap = unstable_cache(
  async (locale: string): Promise<ISitemapField[]> => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'posts',
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

    const sitemap = results.docs
      ? results.docs
          .filter((post) => Boolean(post?.slug))
          .map((post) => ({
            loc:
              locale && locale !== 'da'
                ? `${SITE_URL}/${locale}/posts/${post?.slug}`
                : `${SITE_URL}/posts/${post?.slug}`,
            lastmod: post.updatedAt?.toString() || dateFallback,
          }))
      : []

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET(_req: Request, { params }: { params: Promise<{ locale?: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams?.locale || 'da'
  const sitemap = await getPostsSitemap(locale)

  return getServerSideSitemap(sitemap)
}
