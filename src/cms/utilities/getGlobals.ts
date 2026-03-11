import type { Config } from '@/payload-types'

import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import type { TypedLocale } from 'payload'

type Global = keyof Config['globals']
type GlobalLocale = TypedLocale | 'all'

async function getGlobal(slug: Global, depth = 0, locale?: GlobalLocale) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    ...(locale ? { locale } : {}),
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0, locale?: GlobalLocale) =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, locale ?? 'default'], {
    tags: [`global_${slug}${locale ? `_${locale}` : ''}`],
  })
