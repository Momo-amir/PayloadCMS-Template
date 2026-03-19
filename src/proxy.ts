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
    const response = handleI18nRouting(request)
    const detectedLocale = routing.locales.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    )
    if (detectedLocale === routing.defaultLocale) {
      response.cookies.delete('NEXT_LOCALE')
    } else {
      downgradeToSessionCookie(response)
    }
    return response
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
  const response = handleI18nRouting(request)
  downgradeToSessionCookie(response)
  return response
}

/**
 * Always strip Max-Age from NEXT_LOCALE so it is session-only server-side.
 * Persistence is handled client-side by persistLocaleCookieAfterConsent()
 * once the user grants personalization consent.
 */
function downgradeToSessionCookie(response: NextResponse) {
  const localeCookieValue = response.cookies.get('NEXT_LOCALE')?.value
  if (localeCookieValue) {
    response.cookies.set('NEXT_LOCALE', localeCookieValue, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      // no maxAge = session cookie
    })
  }
}

export const config = {
  matcher: '/((?!admin|api|trpc|_next|_vercel|.*\\..*).*)',
}
