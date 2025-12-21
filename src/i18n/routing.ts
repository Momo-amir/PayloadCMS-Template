import { defineRouting } from 'next-intl/routing'
import localization from './localization'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: localization.locales.map((locale) => locale.code),
  defaultLocale: localization.defaultLocale,
  // Omit the default locale from the URL and only prefix non-default locales
  // - 'as-needed' will serve default locale at '/' and non-default at '/<locale>/...'
  // - middleware will still set a cookie to remember locale preference and may redirect
  //   if it finds an explicit preference when an unprefixed pathname is requested
  localePrefix: 'as-needed',
})

export const { Link, redirect, usePathname } = createNavigation(routing)

export type Locale = (typeof routing.locales)[number]
