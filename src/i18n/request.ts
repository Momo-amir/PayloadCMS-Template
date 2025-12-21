import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import da from './messages/da.json'

type Messages = typeof da

declare global {
  interface IntlMessages extends Messages {}
}

export default getRequestConfig(async (params) => {
  const requestLocale = await params.requestLocale
  let locale = requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
