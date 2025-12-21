'use client'

import React, { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/website/components/elements/select'
import localization from '@/i18n/localization'

export const LocaleSwitcher: React.FC = () => {
  const pathname = usePathname() || '/'
  const router = useRouter()

  const localeCodes = localization.locales.map((l) => l.code)

  const currentLocale = useMemo(() => {
    const firstSeg = pathname.split('/')[1] || ''
    return localeCodes.includes(firstSeg) ? firstSeg : localization.defaultLocale
  }, [pathname, localeCodes])

  const pathWithoutLocale = useMemo(() => {
    for (const code of localeCodes) {
      if (pathname === `/${code}`) return '/'
      if (pathname.startsWith(`/${code}/`)) return pathname.replace(`/${code}`, '')
    }
    return pathname || '/'
  }, [pathname, localeCodes])

  function getHrefForLocale(code: string) {
    // Always navigate to a prefixed path (e.g., /da/about or /en/about) so the middleware
    // updates the locale cookie. The middleware will then redirect to an unprefixed
    // default-locale path when appropriate.
    return `/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
  }

  const onLocaleChange = (code: string) => {
    const href = getHrefForLocale(code)
    router.push(href)
  }

  return (
    <Select onValueChange={onLocaleChange} value={currentLocale}>
      <SelectTrigger
        aria-label="Select language"
        className=" gap-2 border-none text-primary h-auto py-0 px-2 cursor-pointer"
      >
        {/* Show current locale code in trigger */}
        <SelectValue placeholder={localization.defaultLocale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent className="bg-base border border-border text-primary ">
        {localization.locales.map((l) => (
          <SelectItem key={l.code} value={l.code} className="cursor-pointer">
            {/* Show short uppercase code (e.g., "DA", "EN") */}
            {l.code.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LocaleSwitcher
