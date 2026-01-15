import { PayloadRequest, CollectionSlug } from 'payload'
import localization from '@/i18n/localization'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug?: string | null
  req: PayloadRequest
  locale?: string | { code: string } | null
}

const getRequestLocale = (req: PayloadRequest): string | undefined => {
  const anyReq = req as unknown as { locale?: string; i18n?: { language?: string } }
  return anyReq?.locale || anyReq?.i18n?.language
}

export const generatePreviewPath = ({ collection, slug, req, locale }: Props) => {
  const resolvedLocale =
    (typeof locale === 'string' ? locale : locale?.code) ||
    getRequestLocale(req) ||
    localization.defaultLocale
  const resolvedSlug = typeof slug === 'string' ? slug : ''

  const pathWithoutLocale =
    collection === 'pages' && resolvedSlug === 'home'
      ? ''
      : `${collectionPrefixMap[collection]}/${resolvedSlug}`

  const path = pathWithoutLocale ? `/${resolvedLocale}${pathWithoutLocale}` : `/${resolvedLocale}`

  const encodedParams = new URLSearchParams({
    slug: resolvedSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/${resolvedLocale}/next/preview?${encodedParams.toString()}`

  return url
}
