import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import da from './messages/da.json'
import en from './messages/en.json'

const messagesMap = {
  da,
  en,
}

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
    messages: messagesMap[locale as keyof typeof messagesMap] || da,
  }
})
