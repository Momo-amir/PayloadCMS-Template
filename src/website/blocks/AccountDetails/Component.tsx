import React from 'react'
import type { TypedLocale } from 'payload'

import type { LoginConfig } from '@/payload-types'

import { getCachedGlobal } from '@/cms/utilities/getGlobals'
import { getCustomization, getLoginPagePath } from '@/cms/utilities/customization'
import { AccountDetailsClient } from './Component.client'

interface AccountDetailsProps {
  title?: string
  locale?: TypedLocale
}

export const AccountDetails: React.FC<AccountDetailsProps> = async ({ title, locale }) => {
  const config = (await getCachedGlobal('login-config', 1, locale)()) as LoginConfig
  const customization = await getCustomization(locale)()
  const loginPath = getLoginPagePath(customization)

  return <AccountDetailsClient config={config} title={title} loginPath={loginPath} />
}
