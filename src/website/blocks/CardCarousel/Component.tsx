'use client'

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CardCarouselBlock as CardCarouselBlockType } from '@/payload-types'
import Card from '@/website/components/Card/CustomCard'
import InfoCard from '@/website/components/Card/InfoCard'
import { cn } from '@/cms/utilities/ui'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { Button } from '@site/components/elements/button'
import { useTrackImpression } from '@/cms/hooks/useAnalytics'
import RichText from '@/website/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type CardItem = NonNullable<CardCarouselBlockType['cards']>[number]
type Props = CardCarouselBlockType & {
  className?: string
  introContent?: SerializedEditorState
  infoCards?: CardItem[]
}

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
  introContent,
  cards = [],
  infoCards = [],
  cardBackgroundColor,
  cardType,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isMeasured, setIsMeasured] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartRef = useRef<number | null>(null)
  const touchEndRef = useRef<number | null>(null)

  // Track when carousel becomes visible
  const resolvedCards = (cardType === 'info' ? infoCards : cards) ?? []
  const CardComponent = cardType === 'info' ? InfoCard : Card
  const carouselRef = useTrackImpression(
    `Card Carousel (${resolvedCards.length} cards)`,
    'carousel',
  ) as React.RefObject<HTMLElement>

  const perView = getColumnsPerView(resolvedCards.length, containerWidth)
  const pageCount = Math.ceil(resolvedCards.length / perView)
  const variant = useMemo(() => {
    const variantRaw = cardBackgroundColor
    return typeof variantRaw === 'string' && variantRaw !== ''
      ? (variantRaw as 'default' | 'accent' | 'accentThree' | 'dark' | 'secondary' | 'neutral')
      : 'default'
  }, [cardBackgroundColor])

  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return

    let frame = 0
    const measure = () => {
      const next = element.offsetWidth
      setContainerWidth((prev) => (prev === next ? prev : next))
      if (next > 0) setIsMeasured(true)
    }

    measure()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    })
    observer.observe(element)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  React.useEffect(() => {
    setCurrentIndex((prev) => Math.max(0, Math.min(prev, pageCount - 1)))
  }, [pageCount])

  if (!resolvedCards.length) return null

  const goToPage = (page: number) => {
    const clamped = Math.max(0, Math.min(page, pageCount - 1))
    setCurrentIndex(clamped)
  }

  const prev = () => goToPage(currentIndex - 1)
  const next = () => goToPage(currentIndex + 1)

  // Touch/swipe handlers for mobile - allow swiping to change slides
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      touchStartRef.current = e.targetTouches[0].clientX
      touchEndRef.current = null
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      touchEndRef.current = e.targetTouches[0].clientX
    }
  }

  const handleTouchEnd = () => {
    const touchStart = touchStartRef.current
    const touchEnd = touchEndRef.current

    if (touchStart === null || touchEnd === null) return

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
    touchStartRef.current = null
    touchEndRef.current = null
  }

  const slideWidth = containerWidth / perView
  const trackWidth = slideWidth * resolvedCards.length
  const offset = -(currentIndex * containerWidth)

  return (
    <div className="my-16">
      <section ref={carouselRef} className={cn('relative')}>
        {introContent && (
          <div className="container mb-16">
            <RichText className="ms-0" data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="container relative">
          <div className="flex items-center gap-4 relative">
            <Button
              variant={'circle'}
              size={'icon'}
              icon={IconArrowLeft}
              iconSize={36}
              onClick={prev}
              disabled={currentIndex === 0}
              className={cn(
                'hidden lg:flex shrink-0',
                'min-[90rem]:absolute min-[90rem]:-left-16 min-[90rem]:top-1/2 min-[90rem]:-translate-y-1/2',
              )}
            />
            <div ref={containerRef} className="overflow-hidden w-full py-2 touch-pan-y">
              <div
                className={cn(
                  'slide-track carousel-track flex items-stretch gap-x-4',
                  isMeasured && 'transition-transform duration-500 ease-in-out',
                )}
                style={{
                  width: trackWidth,
                  transform: `translate3d(${offset}px, 0, 0)`,
                  visibility: isMeasured ? 'visible' : 'hidden',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {resolvedCards.map((card, i) => {
                  return (
                    <div
                      key={card.id ?? i}
                      className="slide h-auto flex items-stretch min-w-0"
                      style={{ width: slideWidth }}
                    >
                      <CardComponent
                        card={card}
                        variant={variant}
                        className="h-full w-full flex-1 min-w-0"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <Button
              variant={'circle'}
              size={'icon'}
              icon={IconArrowRight}
              iconSize={36}
              onClick={next}
              disabled={currentIndex >= pageCount - 1}
              className={cn(
                'hidden lg:flex shrink-0',
                'min-[90rem]:absolute min-[90rem]:-right-16 min-[90rem]:top-1/2 min-[90rem]:-translate-y-1/2',
              )}
            />
          </div>
          {pageCount > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={cn(
                    'w-3.75 h-3.75 rounded-full cursor-pointer',
                    p === currentIndex ? 'bg-primary' : 'bg-neutral',
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
