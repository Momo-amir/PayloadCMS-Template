import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateBranding: GlobalAfterChangeHook = ({ req: { payload, context } }) => {
  if (!context?.disableRevalidate) {
    payload.logger.info('Revalidating branding tag')
    revalidateTag('global_branding')
  }
}
