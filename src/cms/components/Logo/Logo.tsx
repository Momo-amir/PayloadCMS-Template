import clsx from 'clsx'
import React from 'react'
import logoWhite from '@public/assets/logo-on-dark.svg'
import logo from '@public/assets/logo-on-light.svg'

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
  // Force a specific theme for this logo only
  forceTheme?: 'light' | 'dark'
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
    forceTheme,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const w = width ?? 193
  const h = height ?? 34

  const lightClasses = forceTheme
    ? clsx(
        'max-w-[9.375rem] w-full h-[34px]',
        forceTheme === 'dark' ? 'hidden' : 'block',
        className,
      )
    : clsx('max-w-[9.375rem] w-full dark:hidden h-[34px]', className)

  const darkClasses = forceTheme
    ? clsx(
        'max-w-[9.375rem] w-full h-[34px]',
        forceTheme === 'dark' ? 'block' : 'hidden',
        className,
      )
    : clsx('max-w-[9.375rem] w-full hidden dark:block h-[34px]', className)

  return (
    /* eslint-disable @next/next/no-img-element */
    <div>
      <img
        alt={alt || 'Logo'}
        width={w}
        height={h}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={lightClasses}
        src={lightSrc || logo.src}
      />

      <img
        src={darkSrc || logoWhite.src}
        alt={(alt || 'Logo') + '-darkmode'}
        width={w}
        height={h}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={darkClasses}
      />
    </div>
  )
}
