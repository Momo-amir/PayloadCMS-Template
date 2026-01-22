import { getCachedGlobal } from '@/cms/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandGithub,
  IconBrandTiktok,
} from '@tabler/icons-react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/website/components/Link'
import { Logo } from '@/website/components/elements/Logo'
import { getBranding, toLogoProps } from '@/cms/utilities/branding'
import { ConsentLink } from './ConsentLink'

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: IconBrandFacebook,
  twitter: IconBrandTwitter,
  instagram: IconBrandInstagram,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
  github: IconBrandGithub,
  tiktok: IconBrandTiktok,
}

export async function Footer({ locale }: { locale?: string } = {}) {
  const footerData = (await getCachedGlobal('footer', 1, locale)()) as Footer
  const branding = await getBranding()
  const logoProps = toLogoProps(branding)
  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []
  const themeMode = footerData?.themeMode || 'dark'
  const theme = themeMode === 'light' ? 'light' : 'dark'

  // Always keep mt-auto, but allow dynamic backgroundColor and text color
  const footerClass = ['mt-auto', 'bg-base text-primary'].filter(Boolean).join(' ')

  return (
    <footer className={footerClass} data-theme={theme}>
      <div className="container py-8 gap-8 flex flex-col-reverse md:flex-row md:justify-between items-center">
        <div className="flex flex-col gap-4">
          <Link className="flex items-center" href="/">
            <Logo
              loading="eager"
              priority="high"
              className="h-[34px]"
              theme={theme}
              {...logoProps}
            />
          </Link>

          {/* Company Info */}
          <div className="flex items-center md:items-baseline flex-col gap-1 text-sm">
            {footerData?.cvr && <div>{footerData.cvr}</div>}
            {footerData?.tel && (
              <Link href={`tel:${footerData.tel}`} className="hover:underline">
                {footerData.tel}
              </Link>
            )}
            {footerData?.contact && (
              <Link href={`mailto:${footerData.contact}`} className="hover:underline">
                {footerData.contact}
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-4 items-baseline">
          <div className="flex flex-col items-center md:items-start gap-4 ">
            <nav className="flex flex-wrap md:flex-col gap-x-4 gap-y-2 md:ml-1">
              {navItems.map(({ link }, i) => {
                return <CMSLink key={i} {...link} appearance={'link'} size={'lg'} />
              })}
            </nav>
            <ConsentLink />
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex md:flex-row gap-x-2">
                {socialLinks.map((social, i) => {
                  const IconComponent = socialIcons[social.platform || '']
                  if (!IconComponent || !social.url) return null

                  return (
                    <CMSLink
                      key={i}
                      type="custom"
                      url={social.url}
                      newTab={social.newTab}
                      size="icon"
                      className="hover:scale-110 transition-transform ease duration-150"
                    >
                      <IconComponent className="h-8 w-8" />
                    </CMSLink>
                  )
                })}
              </div>
            )}
          </div>
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
