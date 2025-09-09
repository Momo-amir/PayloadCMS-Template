import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/cms/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { getBranding, toLogoProps } from '@/cms/utilities/branding'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const branding = await getBranding()
  const logoProps = toLogoProps(branding)
  
  return <HeaderClient data={headerData} logoProps={logoProps} />
}
