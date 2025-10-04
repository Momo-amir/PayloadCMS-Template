import clsx from 'clsx'
import React from 'react'
import logoWhite from '@public/assets/logo-on-dark.svg'
import logo from '@public/assets/logo-on-light.svg'
import NextImage from 'next/image'
import type { Theme } from '@/providers/Theme/types'

export interface LogoProps {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  // Optional overrides (from server) to avoid client fetches
  lightSrc?: string
  darkSrc?: string
  alt?: string
  width?: number
  height?: number
  // Optional effective theme to scope logo rendering (header/footer overrides)
  theme?: Theme | null
}

export const Logo = (props: LogoProps) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    lightSrc,
    darkSrc,
    alt,
    width,
    height,
    theme,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const w = width ?? 193
  const h = height ?? 34

  const sizeClass = 'h-[34px]'
  const baseClasses = clsx('max-w-[9.375rem] w-full', sizeClass, className)

  // If a scoped theme is provided, render a single image to avoid
  // incorrect toggling caused by global dark variant from <html>.
  if (theme === 'light') {
    return (
      <div>
        <NextImage
          alt={alt || 'Logo'}
          width={w}
          height={h}
          loading={loading}
          fetchPriority={priority}
          decoding="async"
          className={baseClasses}
          src={lightSrc || logo.src}
        />
      </div>
    )
  }

  if (theme === 'dark') {
    return (
      <div>
        <NextImage
          src={darkSrc || logoWhite.src}
          alt={(alt || 'Logo') + '-darkmode'}
          width={w}
          height={h}
          loading={loading}
          fetchPriority={priority}
          decoding="async"
          className={baseClasses}
        />
      </div>
    )
  }
}
