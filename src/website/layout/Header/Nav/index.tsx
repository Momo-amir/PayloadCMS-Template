'use client'

import React, { useState } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/website/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:gap-6 items-center">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" className="uppercase" />
        })}
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden ml-auto p-2 rounded-xl hover:bg-accent/10 transition-colors relative"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <IconMenu2
          className={`w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
          }`}
        />
        <IconX
          className={`w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
          }`}
        />
      </button>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-full left-0 right-0 bg-base rounded-xl mx-4 mt-2 px-3 py-2 md:hidden overflow-hidden transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen
            ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col p-4 gap-3">
          {navItems.map(({ link }, i) => {
            return (
              <div key={i} onClick={() => setIsMobileMenuOpen(false)} className="">
                <CMSLink {...link} appearance="link" className="uppercase " />
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}
