import type { Metadata } from 'next'
import type { TypedLocale } from 'payload'

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserLogin } from '@site/blocks/UserLogin/Component'
import { getCustomization, getLoginPagePath } from '@/cms/utilities/customization'

type Args = {
  params: Promise<{ locale: TypedLocale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Thin entry point for /login. If an editor selected a Login page in Customization, forward there
// (preserving params, incl. ?view=); otherwise render the block inline as a sensible default.
export default async function Login({ params, searchParams }: Args) {
  const { locale } = await params
  const search = await searchParams
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  const customization = await getCustomization(locale)()
  const loginPath = getLoginPagePath(customization)

  if (loginPath !== '/login') {
    const query = new URLSearchParams(
      Object.entries(search).flatMap(([key, value]) =>
        value === undefined ? [] : [[key, Array.isArray(value) ? value.join(',') : value]],
      ),
    ).toString()
    redirect(query ? `${loginPath}?${query}` : loginPath)
  }

  return (
    <>
      <UserLogin locale={locale} />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
}
