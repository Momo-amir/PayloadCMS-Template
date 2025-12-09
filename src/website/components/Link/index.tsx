import { Button, type ButtonProps } from '@/website/components/elements/button'
import { cn } from '@/cms/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { trackButtonClick } from '@/cms/utilities/analytics'
import { usePrivacy } from '@/providers/Privacy'

import type { Page, Post } from '@/payload-types'

export type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  colorPalette?: string | null
  label?: string | null
  newTab?: boolean | null
  onClick?: () => void
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  trackingSection?: string // Optional: specify which section this link is in (e.g., "Hero", "Footer")
  type?: 'custom' | 'reference' | null
  url?: string | null
  useCustomColorTheme?: boolean | null
}

export type CMSLinkReference = NonNullable<CMSLinkType['reference']>

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    colorPalette,
    label,
    newTab,
    onClick,
    reference,
    size: sizeFromProps,
    trackingSection,
    url,
    useCustomColorTheme,
  } = props

  const { cookieConsent } = usePrivacy()

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  // Only apply colorPalette when useCustomColorTheme is true AND colorPalette has a value
  const hasColorPalette = useCustomColorTheme === true && colorPalette && colorPalette.trim() !== ''
  const effectiveAppearance = hasColorPalette ? 'default' : appearance

  // Combine className with color palette only when custom theme is enabled
  const linkClassName = cn(className, hasColorPalette ? colorPalette : '')

  // Automatic tracking handler
  const handleClick = () => {
    // Track the button/link click if consent is given
    if (cookieConsent && label) {
      trackButtonClick(label, trackingSection, href || '')
    }

    // Call custom onClick if provided
    if (onClick) {
      onClick()
    }
  }

  /* Ensure we don't break any styles set by richText */
  if (effectiveAppearance === 'inline') {
    return (
      <Link
        className={linkClassName}
        href={href || url || ''}
        onClick={handleClick}
        {...newTabProps}
      >
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={linkClassName} size={size} variant={effectiveAppearance}>
      <Link href={href || url || ''} onClick={handleClick} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
