'use client'

import React, { useState, useRef, useEffect } from 'react'
import { IconMenu2, IconX, IconChevronDown } from '@tabler/icons-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/website/components/Link'
import { Button } from '@/website/components/elements/button'

type NavItem = NonNullable<HeaderType['navItems']>[number]

const DropdownItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <Button
        onClick={() => setIsOpen((o) => !o)}
        variant="link"
        size="clear"
        className={`uppercase gap-1 ${isOpen ? 'after:w-full' : ''}`}
      >
        {item.dropdownLabel}
        <IconChevronDown
          strokeWidth={2.5}
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      <div
        className={`absolute top-full left-0 mt-2 min-w-40 bg-base rounded-xl px-2 py-2 flex flex-col gap-1 shadow-md transition-all duration-200 origin-top ${
          isOpen
            ? 'opacity-100 scale-y-100 pointer-events-auto'
            : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        {item.children?.map(({ link }, i) => (
          <div key={i} onClick={() => setIsOpen(false)} className="px-2 py-1">
            <CMSLink {...link} appearance="link" className="uppercase" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null)

  const toggleMobileDropdown = (i: number) => {
    setOpenMobileDropdown((current) => (current === i ? null : i))
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:gap-6 items-center">
        {navItems.map((item, i) => {
          if (item.type === 'dropdown') {
            return <DropdownItem key={i} item={item} />
          }
          return <CMSLink key={i} {...item.link} appearance="link" className="uppercase" />
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
          {navItems.map((item, i) => {
            if (item.type === 'dropdown') {
              const isExpanded = openMobileDropdown === i
              return (
                <div key={i}>
                  <Button
                    onClick={() => toggleMobileDropdown(i)}
                    variant="link"
                    size="clear"
                    className="uppercase gap-1"
                  >
                    {item.dropdownLabel}
                    <IconChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </Button>
                  <div
                    className={`flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-200 ${
                      isExpanded ? 'mt-2 max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.children?.map(({ link }, j) => (
                      <div key={j} onClick={() => setIsMobileMenuOpen(false)}>
                        <CMSLink {...link} appearance="link" className="uppercase" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return (
              <div key={i} onClick={() => setIsMobileMenuOpen(false)}>
                <CMSLink {...item.link} appearance="link" className="uppercase" />
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}
