import React from 'react'
import { ArchiveBlock } from '../ArchiveBlock/Component'
import { CallToActionBlock } from '../CallToAction/Component'
import { ContentBlock } from '../Content/Component'
import { FormBlock } from '../Form/Component'
import { MediaBlock } from '../MediaBlock/Component'

// 1) slug → React component map for TWO-BLOCK children
export const childComponents = {
  archive: ArchiveBlock,
  cta: CallToActionBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
} as const

// 2) Discriminated‐union of “child” props for TwoBlock
type ComponentMap = typeof childComponents
export type TwoBlockField = {
  [K in keyof ComponentMap]: { blockType: K } & React.ComponentProps<ComponentMap[K]>
}[keyof ComponentMap]

// 3) type-safe renderer for a single child
export function renderChildField(field: TwoBlockField, key: React.Key, enableGutter = true) {
  const sharedProps = enableGutter ? { enableGutter: false } : {}
  switch (field.blockType) {
    case 'archive':
      return <ArchiveBlock key={key} {...field} {...sharedProps} />
    case 'cta':
      return <CallToActionBlock key={key} {...field} {...sharedProps} />
    case 'content':
      return <ContentBlock key={key} {...field} {...sharedProps} />
    case 'formBlock':
      return <FormBlock key={key} {...field} {...sharedProps} />
    case 'mediaBlock':
      return <MediaBlock key={key} {...field} {...sharedProps} />
    default:
      return null
  }
}
