import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import localization from '@/i18n/localization'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    revalidateTag('global_header', 'max')
    for (const locale of localization.locales) {
      revalidateTag(`global_header_${locale.code}`, 'max')
    }
  }

  return doc
}
