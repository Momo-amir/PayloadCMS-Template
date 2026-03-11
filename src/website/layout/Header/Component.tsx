import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/cms/utilities/getGlobals'
import React from 'react'
import type { TypedLocale } from 'payload'

import type { Header } from '@/payload-types'
import { getCustomization, toLogoProps } from '@/cms/utilities/customization'

export async function Header({ locale }: { locale?: TypedLocale } = {}) {
  const headerData: Header = await getCachedGlobal('header', 1, locale)()
  const customization = await getCustomization()()
  const logoProps = toLogoProps(customization)
  return <HeaderClient data={headerData} logoProps={logoProps} />
}
