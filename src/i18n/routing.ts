import { defineRouting } from 'next-intl/routing'
import localization from './localization'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: localization.locales.map((locale) => locale.code),
  defaultLocale: localization.defaultLocale,
})

export const { Link, redirect, usePathname } = createNavigation(routing)

export type Locale = (typeof routing.locales)[number]
