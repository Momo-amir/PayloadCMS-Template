import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/cms/utilities/getGlobals'
import React from 'react'
import type { TypedLocale } from 'payload'

import type { Header } from '@/payload-types'
import {
  getAccountPagePath,
  getCustomization,
  getLoginPagePath,
  toLogoProps,
} from '@/cms/utilities/customization'

export async function Header({ locale }: { locale?: TypedLocale } = {}) {
  const headerData: Header = await getCachedGlobal('header', 1, locale)()
  const customization = await getCustomization(locale)()
  const logoProps = toLogoProps(customization)
  const loginPath = getLoginPagePath(customization)
  const accountPath = getAccountPagePath(customization)

  return (
    <HeaderClient
      data={headerData}
      loginPath={loginPath}
      accountPath={accountPath}
      logoProps={logoProps}
    />
  )
}
