import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import localization from '@/i18n/localization'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    revalidateTag('global_footer', 'max')
    for (const locale of localization.locales) {
      revalidateTag(`global_footer_${locale.code}`, 'max')
    }
  }

  return doc
}
