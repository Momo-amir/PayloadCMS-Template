import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import type { TypedLocale } from 'payload'
import blockExports from './exports'

const blockComponents: Record<string, React.FC<any>> = {}

blockExports.blocks.forEach((block) => {
  if (block.component) {
    blockComponents[block.slug] = block.component
  }
})

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale?: TypedLocale
  pageSlug?: string
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}> = (props) => {
  const { blocks, locale, pageSlug, searchParams } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block
                    {...block}
                    disableInnerContainer
                    locale={locale}
                    pageSlug={pageSlug}
                    searchParams={searchParams}
                  />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
