'use client'

import { Button, type ButtonProps } from '@/website/components/elements/button'
import Link from 'next/link'
import React from 'react'
import { trackButtonClick } from '@/cms/utilities/analytics'

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
  type?: 'custom' | 'reference' | null
  url?: string | null
  useCustomColorTheme?: boolean | null
  // Analytics tracking (optional)
  trackingName?: string
  trackingSection?: string
  enableTracking?: boolean
}

export type CMSLinkReference = NonNullable<CMSLinkType['reference']>

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    onClick,
    reference,
    size: sizeFromProps,
    url,
    trackingName,
    trackingSection,
    enableTracking = true,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  // Handle click with optional tracking
  const handleClick = () => {
    if (enableTracking && trackingName) {
      trackButtonClick(trackingName, trackingSection, href || undefined)
    }
    if (onClick) {
      onClick()
    }
  }

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  if (appearance === 'inline') {
    return (
      <Link className={className} href={href || url || ''} onClick={handleClick} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link href={href || url || ''} onClick={handleClick} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
