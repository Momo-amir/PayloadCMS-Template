'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import canUseDOM from '@/cms/utilities/canUseDOM'
import { cn } from '@/cms/utilities/ui'

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
  const [isScrolled, setIsScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

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
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-colors ease-out duration-200  border-b border-transparent',
        isScrolled ? 'bg-base' : 'bg-transparent',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container flex justify-between py-6">
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
