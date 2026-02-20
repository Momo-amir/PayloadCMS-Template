'use client'

import React, { useEffect, useRef, useState } from 'react'
import RichText from '@/website/components/RichText'
import { cn } from '@/cms/utilities/ui'
import { Plus } from 'lucide-react'
import type { AccordionBlock as AccordionBlockType } from '@/payload-types'

type AccordionItem = NonNullable<AccordionBlockType['accordions']>[number]

type AccordionBehaviorProps = {
  grouped?: boolean
  lastInGroup?: boolean
  opened?: boolean | null
  onOpen?: () => void
  onClose?: () => void
}

export type AccordionProps = Pick<AccordionItem, 'title' | 'content'> & AccordionBehaviorProps

export const Accordion: React.FC<AccordionProps> = ({
  title,
  content,
  grouped,
  lastInGroup,
  opened = null,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(opened || false)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const actualOpen = opened == null ? isOpen : opened

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    const updateHeight = () => {
      setContentHeight(element.scrollHeight)
    }

    updateHeight()

    const observer = new ResizeObserver(() => {
      updateHeight()
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [content])

  return (
    <div className={cn(grouped ? '' : 'my-4')}>
      <div className={cn('border-t', grouped && !lastInGroup ? null : 'border-b', 'container')}>
        <button
          type="button"
          onClick={() =>
            opened == null ? setIsOpen((prev) => !prev) : actualOpen ? onClose?.() : onOpen?.()
          }
          className="flex w-full items-center justify-between py-4 transition-colors hover:cursor-pointer"
          aria-expanded={actualOpen}
        >
          <h3 className="font-semibold">{title}</h3>
          <Plus
            className={cn(
              'h-5 w-5 shrink-0 transition-transform duration-200',
              actualOpen && 'rotate-225',
            )}
          />
        </button>
        <div
          className={cn(
            'overflow-hidden transition-opacity duration-200',
            actualOpen
              ? 'h-(--radix-accordion-content-height) animate-accordion-down opacity-100'
              : 'h-0 animate-accordion-up opacity-0',
          )}
          style={
            { '--radix-accordion-content-height': `${contentHeight}px` } as React.CSSProperties
          }
          aria-hidden={!actualOpen}
        >
          <div ref={contentRef} className="pb-4">
            {content && <RichText data={content} enableGutter={false} />}
          </div>
        </div>
      </div>
    </div>
  )
}
