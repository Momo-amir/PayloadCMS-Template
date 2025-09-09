import { getCachedGlobal } from '@/cms/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/cms/components/Link'
import { Logo } from '@/cms/components/Logo/Logo'
import { getBranding, toLogoProps } from '@/cms/utilities/branding'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const branding = await getBranding()
  const logoProps = toLogoProps(branding)
  const navItems = footerData?.navItems || []
  const backgroundColor = footerData?.backgroundColor || ''
  const theme = backgroundColor.includes('light-mode') ? 'light' : 'dark'

  // Always keep mt-auto, but allow dynamic backgroundColor and text color
  const footerClass = ['mt-auto', backgroundColor || 'bg-secondary text-primary']
    .filter(Boolean)
    .join(' ')

  return (
    <footer className={footerClass} data-theme={theme}>
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo
            loading="eager"
            priority="high"
            className="h-[34px]"
            {...logoProps}
            forceTheme={theme}
          />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
