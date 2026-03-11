import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateCustomization: GlobalAfterChangeHook = ({ req: { payload, context } }) => {
  if (context?.disableRevalidate) {
    return
  }

  payload.logger.info('Revalidating customization tag and localized home routes')

  revalidateTag('global_customization', 'max')
  revalidateTag('pages-sitemap', 'max')
  revalidatePath('/')
  revalidatePath('/en')
}
