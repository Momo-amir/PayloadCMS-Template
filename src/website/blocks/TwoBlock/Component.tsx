import React from 'react'
import { ArchiveBlock } from '../ArchiveBlock/Component'
import { CallToActionBlock } from '../CallToAction/Component'
import { ContentBlock } from '../Content/Component'
import { FormBlock } from '../Form/Component'
import { MediaBlock } from '../MediaBlock/Component'

// only the blocks that can live inside TwoBlock:
const childComponents = {
  archive: ArchiveBlock,
  cta: CallToActionBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
} as const

type BlockKey = keyof typeof childComponents
type BlockData = { blockType: BlockKey } & Record<string, unknown>

export const TwoBlock: React.FC<{
  left?: BlockData[]
  right?: BlockData[]
}> = ({ left = [], right = [] }) => {
  return (
    <div className="flex flex-row gap-4 rounded-sm m-12">
      {[left, right].map((column, colIdx) => (
        <div key={`col-${colIdx}`}>
          {column.map((block, i) => {
            const Comp = childComponents[block.blockType]
            if (!Comp) return null
            return (
              <React.Fragment key={`block-${colIdx}-${i}`}>
                {/* @ts-ignore we know 'block` matches whatever Comp expects,
                  but TS can’t prove it */}
                <Comp {...block} />
              </React.Fragment>
            )
          })}
        </div>
      ))}
    </div>
  )
}
