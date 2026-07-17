import type { Metadata } from 'next'
import type { TypedLocale } from 'payload'

import React from 'react'
import { getCustomization, getLoginPagePath } from '@/cms/utilities/customization'

import { LogoutPage } from '@site/components/auth/LogoutPage.client'

type Args = {
  params: Promise<{ locale: TypedLocale }>
}

export default async function Logout(_props: Args) {
  const { locale } = await _props.params
  const customization = await getCustomization(locale)()
  const loginPath = getLoginPagePath(customization)

  return (
    <div className="container my-16 max-w-lg">
      <LogoutPage loginPath={loginPath} />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Logout',
  description: 'You have been logged out.',
}
