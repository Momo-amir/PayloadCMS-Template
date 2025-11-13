import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateBranding: GlobalAfterChangeHook = ({ req: { payload, context } }) => {
  // Skip revalidation if explicitly disabled or if this is an autosave/draft operation
  if (context?.disableRevalidate) {
    return
  }

  payload.logger.info('Revalidating branding tag')
  revalidateTag('global_branding')
}
