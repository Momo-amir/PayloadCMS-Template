import { PayloadRequest, CollectionSlug } from 'payload'
import localization from '@/i18n/localization'
import { getPostsPagePath } from '@/cms/utilities/customization'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug?: string | null
  path?: string | null
  req: PayloadRequest
  locale?: string | { code: string } | null
}

const getRequestLocale = (req: PayloadRequest): string | undefined => {
  const anyReq = req as unknown as { locale?: string; i18n?: { language?: string } }
  return anyReq?.locale || anyReq?.i18n?.language
}

export const generatePreviewPath = async ({ collection, slug, path: pathOverride, req, locale }: Props) => {
  const resolvedLocale =
    (typeof locale === 'string' ? locale : locale?.code) ||
    getRequestLocale(req) ||
    localization.defaultLocale
  const resolvedSlug = typeof slug === 'string' ? slug : ''

  let prefix = collectionPrefixMap[collection] ?? ''

  if (collection === 'posts' && !pathOverride) {
    try {
      const customizationData = await req.payload.findGlobal({
        slug: 'customization' as never,
        depth: 1,
      })
      prefix = getPostsPagePath(customizationData as never)
    } catch {
      // fall back to default
    }
  }

  const pathWithoutLocale = pathOverride ? pathOverride : `${prefix}/${resolvedSlug}`

  const path = pathWithoutLocale ? `/${resolvedLocale}${pathWithoutLocale}` : `/${resolvedLocale}`

  const encodedParams = new URLSearchParams({
    slug: resolvedSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  return `/${resolvedLocale}/next/preview?${encodedParams.toString()}`
}
