import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import localization from '@/i18n/localization'

export const revalidateLoginConfig: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating login config`)

    revalidateTag('global_login-config', 'max')
    for (const locale of localization.locales) {
      revalidateTag(`global_login-config_${locale.code}`, 'max')
    }
  }

  return doc
}
