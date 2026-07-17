'use client'
import { useLocalTheme } from '@/providers/Theme/LocalTheme/LocalTheme'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/providers/Theme'
import { LocaleSwitcher } from '@/website/components/LocaleSwitcher/LocaleSwitcher.client'

import canUseDOM from '@/cms/utilities/canUseDOM'
import { cn } from '@/cms/utilities/ui'

import type { Header } from '@/payload-types'

import { Logo } from '@/website/components/elements/Logo'
import type { LogoProps } from '@/website/components/elements/Logo'
import { HeaderNav } from './Nav'
import { AccountLink } from '@/website/components/auth/AccountLink.client'

interface HeaderClientProps {
  data: Header
  loginPath: string
  logoProps?: LogoProps
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, loginPath, logoProps }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [isScrolled, setIsScrolled] = useState(false)
  const { override: headerTheme } = useLocalTheme('header')
  const { theme: rootTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!canUseDOM) return

    // Create a sentinel element at the top of the page
    const sentinel = document.createElement('div')
    sentinel.style.position = 'absolute'
    sentinel.style.top = '0'
    sentinel.style.height = '1px'
    sentinel.style.width = '1px'
    sentinel.style.pointerEvents = 'none'
    document.body.insertBefore(sentinel, document.body.firstChild)

    // Use Intersection Observer instead of scroll listener
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsScrolled(!entry.isIntersecting)
        }
      },
      {
        threshold: [0],
        rootMargin: '0px',
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-colors ease-out duration-200  border-b border-transparent',
        isScrolled ? 'bg-base' : 'bg-transparent',
      )}
      data-theme={headerTheme ?? undefined}
    >
      <div className="container flex items-center md:gap-x-12 lg:gap-x-24 py-6">
        <Link href="/">
          <Logo
            theme={mounted ? (headerTheme ?? rootTheme ?? null) : null}
            loading="eager"
            priority="high"
            className=""
            {...logoProps}
          />
        </Link>
        <HeaderNav data={data} />
        <div className="ml-3 md:ml-auto flex flex-row items-center gap-x-2">
          {data.showLanguageSwitcher && <LocaleSwitcher />}
          <div className="flex flex-row items-center gap-x-2">
            <AccountLink loginPath={loginPath} />
          </div>
        </div>
      </div>
    </header>
  )
}
