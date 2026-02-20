'use client'

import React from 'react'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { Accordion } from '@/website/components/Accordion'
import type { AccordionBlock as AccordionBlockProps } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import RichText from '@/website/components/RichText'
import { cn } from '@/cms/utilities/ui'

type Props = AccordionBlockProps & {
  introContent?: SerializedEditorState
  sideBySideWithIntro?: boolean | null
}

export const AccordionBlockComponent: React.FC<Props> = ({
  accordions,
  singleOpen = false,
  introContent,
  sideBySideWithIntro = false,
}) => {
  const [openedIndex, setOpenedIndex] = React.useState<number | null>(null)
  const items = accordions ?? []
  const intro = introContent ?? null
  const shouldShowSideBySide = Boolean(sideBySideWithIntro && intro)

  const accordionList = (
    <>
      {items.map((accordion, index) => (
        <Accordion
          {...(singleOpen
            ? {
                opened: openedIndex === index,
                onOpen: () => setOpenedIndex(index),
                onClose: () => setOpenedIndex(null),
              }
            : {})}
          grouped
          key={accordion.id ?? index}
          title={accordion.title}
          content={accordion.content}
          lastInGroup={index === items.length - 1}
        />
      ))}
    </>
  )

  return (
    <div className="my-16">
      <TrackImpression componentName="Accordion" componentType="Accordion">
        {shouldShowSideBySide ? (
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                {intro && <RichText className="ms-0" data={intro} enableGutter={false} />}
              </div>
              <div className={cn('lg:col-span-7')}>{accordionList}</div>
            </div>
          </div>
        ) : (
          <>
            {intro && (
              <div className="container mb-16">
                <RichText className="ms-0" data={intro} enableGutter={false} />
              </div>
            )}
            {accordionList}
          </>
        )}
      </TrackImpression>
    </div>
  )
}
