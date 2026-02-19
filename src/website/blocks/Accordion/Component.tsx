'use client'

import React, { useState } from 'react'
import RichText from '@/website/components/RichText'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { cn } from '@/cms/utilities/ui'
import { ChevronDown, Plus } from 'lucide-react'

export interface AccordionProps {
  title: string;
  content: any;
  // Optional props for when Accordion is used within an AccordionGroup
  grouped?: boolean;
  lastInGroup?: boolean;
  opened?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Accordion: React.FC<AccordionProps> = ({ title, content, grouped, lastInGroup, opened = null, onOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(opened || false)

  const actualOpen = opened == null ? isOpen : opened;
  return (
    <div className={cn(
      grouped ? '' : 'my-4'
    )}>
      <TrackImpression
        componentName={title || "Accordion"}
        componentType="Accordion"
      >
        <div className={cn(
          "border-t-1",
          grouped && !lastInGroup ? null : "border-b-1",
          "rounded",
          "container",
        )}>
          <button
            type="button"
            onClick={() => opened == null ? setIsOpen((prev) => !prev) : actualOpen ? onClose?.() : onOpen?.()}
            className="flex w-full items-center justify-between py-4 text-left font-semibold text-body transition-colors hover:cursor-pointer"
            aria-expanded={actualOpen}
          >
            <span>{title}</span>
            <Plus
              className={cn(
                'h-5 w-5 shrink-0 transition-transform duration-200',
                actualOpen && 'rotate-225', // Spinning more than just 45 for a little spinout effect
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-200',
              actualOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="pb-4">
              <RichText data={content} enableGutter={false} />
            </div>
          </div>
        </div>
      </TrackImpression>
    </div>
  )
}
