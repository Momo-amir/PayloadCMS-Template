'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import canUseDOM from '@/cms/utilities/canUseDOM'

import type { Header } from '@/payload-types'

import { Logo } from '@/website/components/Logo'
import type { LogoProps } from '@/website/components/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  logoProps?: LogoProps
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, logoProps }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const rootTheme = canUseDOM
    ? (document.documentElement.getAttribute('data-theme') as string)
    : null
  const effectiveTheme = theme || rootTheme

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="container relative z-20"
      {...(hasMounted ? { 'data-theme': effectiveTheme } : {})}
    >
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo
            loading="eager"
            priority="high"
            className=""
            {...logoProps}
            forceTheme={theme === 'dark' || theme === 'light' ? theme : null}
          />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
