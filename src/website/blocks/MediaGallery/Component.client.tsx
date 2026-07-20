'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/cms/utilities/ui'

type Props = {
  children: React.ReactNode
  className?: string
}

// Thin client wrapper: only owns the IntersectionObserver + visibility toggle
// so the gallery's markup (images, captions) stays server-rendered.
export const ScrollRevealGrid: React.FC<Props> = ({ children, className }) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(grid)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={gridRef} className={cn(className, isInView && 'gallery-stagger-item-visible-scope')}>
      {children}
    </div>
  )
}
