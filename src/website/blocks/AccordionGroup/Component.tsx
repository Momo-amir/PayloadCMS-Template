'use client'

import React from 'react'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { Accordion, AccordionProps } from '../Accordion/Component'

interface AccordionGroupProps {
  accordions: AccordionProps[],
  singleOpen?: boolean; // Optional prop to indicate if only one accordion can be open at a time
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  accordions,
  singleOpen = false
}) => {
  const [openedIndex, setOpenedIndex] = React.useState<number | null>(null)

  return (
    <div className="my-16">
      <TrackImpression
        componentName="AccordionGroup"
        componentType="AccordionGroup"
      >
        {accordions.map((accordion, index) => (
          <Accordion
            {...(singleOpen ? ({
              opened: openedIndex === index,
              onOpen: () => setOpenedIndex(index),
              onClose: () => setOpenedIndex(null)
            }): { })}
            grouped
            key={index}
            title={accordion.title}
            content={accordion.content}
            lastInGroup={index === accordions.length - 1} // Pass whether this is the last accordion in the group
          />
        ))}
      </TrackImpression>
    </div>
  )
}
