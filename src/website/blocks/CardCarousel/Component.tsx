'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { CardCarouselBlock as CardCarouselBlockType } from '@/payload-types'
import Card from '@/website/components/Card/CustomCard'
import { cn } from '@/cms/utilities/ui'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { Button } from '@site/components/elements/button'

type Props = CardCarouselBlockType & { className?: string }

const getColumnsPerView = (cardCount: number, containerWidth: number): number => {
  const isMobile = containerWidth < 768
  const isTablet = containerWidth >= 768 && containerWidth < 1024
  switch (cardCount) {
    case 1:
      return 1
    case 2:
      return isMobile ? 1 : 2
    case 3:
    default:
      if (isMobile) return 1
      if (isTablet) return 2
      return 3
  }
}

export const CardCarouselBlock: React.FC<Props> = ({
  heading,
  description,
  cards = [],
  cardBackgroundColor,
  colorMode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const perView = getColumnsPerView(cards.length, containerWidth)
  const pageCount = Math.ceil(cards.length / perView)

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (!cards.length) return null

  const goToPage = (page: number) => {
    const clamped = Math.max(0, Math.min(page, pageCount - 1))
    setCurrentIndex(clamped)
  }

  const prev = () => goToPage(currentIndex - 1)
  const next = () => goToPage(currentIndex + 1)

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentIndex < pageCount - 1) {
      next()
    }
    if (isRightSwipe && currentIndex > 0) {
      prev()
    }

    // Reset
    setTouchStart(0)
    setTouchEnd(0)
  }

  const slideWidth = containerWidth / perView
  const trackWidth = slideWidth * cards.length
  const offset = -(currentIndex * containerWidth)

  return (
    <section className={cn('container relative')}>
      {heading && <h1 className="text-5xl text-center font-semibold mb-10">{heading}</h1>}
      {description && (
        <div className="w-1/2 mx-auto">
          <p className="text-center mb-16">{description}</p>
        </div>
      )}{' '}
      <div className="flex items-center gap-4">
        <Button
          variant={'arrow'}
          icon={IconArrowLeft}
          iconSize={36}
          onClick={prev}
          disabled={currentIndex === 0}
          className="hidden lg:flex flex-shrink-0"
        />
        <div ref={containerRef} className="overflow-hidden w-full">
          <div
            className="slide-track flex transition-transform duration-500 ease-in-out"
            style={{
              width: trackWidth,
              transform: `translateX(${offset}px)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {cards.map((card, i) => {
              const variantRaw =
                colorMode === 'per-card' ? card.cardBackgroundColor : cardBackgroundColor
              const variant =
                typeof variantRaw === 'string' && variantRaw !== ''
                  ? (variantRaw as 'default' | 'accent' | 'accentThree' | 'dark' | 'secondary')
                  : 'default'

              return (
                <div key={card.id ?? i} className="slide px-2" style={{ width: slideWidth }}>
                  <Card card={card} variant={variant} className="h-full" />
                </div>
              )
            })}
          </div>
        </div>

        <Button
          variant={'arrow'}
          icon={IconArrowRight}
          iconSize={36}
          onClick={next}
          disabled={currentIndex >= pageCount - 1}
          className="hidden lg:flex flex-shrink-0"
        />
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: pageCount }).map((_, p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={cn(
              'w-[15px] h-[15px] rounded-full cursor-pointer',
              p === currentIndex ? 'bg-black' : 'bg-border',
            )}
          />
        ))}
      </div>
    </section>
  )
}
