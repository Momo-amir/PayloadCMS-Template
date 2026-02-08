import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    return handleI18nRouting(request)
  }

  // For unprefixed paths, check for locale cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value

  // If cookie exists and is valid, redirect to that locale
  if (localeCookie && routing.locales.includes(localeCookie as (typeof routing.locales)[number])) {
    // Don't redirect default locale with 'as-needed' prefix mode
    if (localeCookie !== routing.defaultLocale) {
      const url = request.nextUrl.clone()
      url.pathname = `/${localeCookie}${pathname}`
      return NextResponse.redirect(url)
    }
  }

  // No valid cookie, use default locale (no redirect needed with 'as-needed' mode)
  return handleI18nRouting(request)
}

export const config = {
  matcher: '/((?!admin|api|trpc|_next|_vercel|.*\\..*).*)',
}
