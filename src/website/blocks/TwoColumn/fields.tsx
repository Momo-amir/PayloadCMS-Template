import React from 'react'
import { ArchiveBlock } from '../Archive/Component'
import { CallToActionBlock } from '../CallToAction/Component'
import { ContentBlock } from '../Content/Component' // Temporarily kept for backward compatibility
import { FormBlock } from '../Form/Component'
import { MediaBlock } from '../Media/Component'
import { RichTextBlock } from '../RichText/Component'

// 1) slug → React component map for TWO-BLOCK children
export const childComponents = {
  archiveBlock: ArchiveBlock,
  callToActionBlock: CallToActionBlock,
  contentBlock: ContentBlock, // Temporarily kept for backward compatibility
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  richTextBlock: RichTextBlock,
} as const

// 2) Discriminated‐union of “child” props for TwoBlock
type ComponentMap = typeof childComponents
export type TwoBlockField = {
  [K in keyof ComponentMap]: { blockType: K } & React.ComponentProps<ComponentMap[K]>
}[keyof ComponentMap]

// 3) type-safe renderer for a single child
export function renderChildField(
  field: TwoBlockField,
  key: React.Key,
  enableGutter = true,
  contentTextClassName?: string,
) {
  const sharedProps = enableGutter ? { enableGutter: false } : {}
  switch (field.blockType) {
    case 'archiveBlock':
      return <ArchiveBlock key={key} {...field} {...sharedProps} />
    case 'callToActionBlock':
      return (
        <CallToActionBlock
          key={key}
          {...field}
          {...sharedProps}
          textClassName={contentTextClassName}
        />
      )
    case 'richTextBlock':
      return (
        <RichTextBlock key={key} {...field} {...sharedProps} textClassName={contentTextClassName} />
      )
    case 'formBlock':
      return (
        <FormBlock
          key={key}
          {...field}
          {...sharedProps}
          introTextClassName={contentTextClassName}
        />
      )
    case 'mediaBlock':
      return <MediaBlock key={key} {...field} {...sharedProps} />
    default:
      return null
  }
}
