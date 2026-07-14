import React from 'react'
import type { ComponentBlock } from '@/website/types/ComponentBlock'
import { TwoColumnBlock } from './config'

// Data-driven: the child slug → React component map is derived from the container config's
// `type: 'blocks'` fields, so pruning a child from the config automatically prunes rendering.
function collectChildBlocks(block: ComponentBlock): ComponentBlock[] {
  const out = new Map<string, ComponentBlock>()
  for (const field of block.fields ?? []) {
    if ('type' in field && field.type === 'blocks' && 'blocks' in field) {
      for (const child of (field.blocks as ComponentBlock[]) ?? []) out.set(child.slug, child)
    }
  }
  return [...out.values()]
}

// Computed lazily (not at module load) to avoid a circular-import init cycle with ./config.
let _childComponents: Record<string, ComponentBlock['component']> | null = null
function getChildComponents(): Record<string, ComponentBlock['component']> {
  if (!_childComponents) {
    _childComponents = Object.fromEntries(
      collectChildBlocks(TwoColumnBlock).map((b) => [b.slug, b.component]),
    )
  }
  return _childComponents
}

export type TwoBlockField = { blockType: string } & Record<string, unknown>

// Per-child props that some children accept for in-column styling.
const CONTENT_TEXT_PROP: Record<string, string> = {
  callToActionBlock: 'textClassName',
  richTextBlock: 'textClassName',
  formBlock: 'introTextClassName',
}

export function renderChildField(
  field: TwoBlockField,
  key: React.Key,
  enableGutter = true,
  contentTextClassName?: string,
) {
  const Component = getChildComponents()[field.blockType]
  if (!Component) return null
  const sharedProps = enableGutter ? { enableGutter: false } : {}
  const textProp = CONTENT_TEXT_PROP[field.blockType]
  const extra = textProp && contentTextClassName ? { [textProp]: contentTextClassName } : {}
  return <Component key={key} {...(field as Record<string, unknown>)} {...sharedProps} {...extra} />
}
