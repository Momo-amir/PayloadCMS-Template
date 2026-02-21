import type { NextRequest } from 'next/server'

export function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  const trustedOrigins = (process.env.ANALYTICS_TRUSTED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  const value = origin || referer
  if (!value || trustedOrigins.length === 0) {
    return false
  }

  try {
    const url = new URL(value)
    const originString = `${url.protocol}//${url.host}`
    return trustedOrigins.includes(originString)
  } catch {
    return false
  }
}
