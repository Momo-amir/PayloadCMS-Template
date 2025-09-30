import React from 'react'

import { cn } from '@/cms/utilities/ui'

import { renderChildField, TwoBlockField } from './fields'

export const TwoBlock: React.FC<{
  left?: TwoBlockField[]
  right?: TwoBlockField[]
  backgroundColor?: string
}> = ({ left = [], right = [], backgroundColor }) => {
  const hasBg = Boolean(backgroundColor)
  const rightHasMedia = right.some((field) => field.blockType === 'mediaBlock')
  const gridClasses = cn(
    'grid grid-cols-1 md:grid-cols-2 items-center',
    backgroundColor,
    hasBg ? 'two-background-spacing' : 'gap-x-8',
  )

  return (
    <div className="container">
      <div className={gridClasses}>
        {[left, right].map((column, colIdx) => {
          const colClass = cn(
            'two-column-layout flex flex-col',
            colIdx === 0 ? 'two-column-left' : 'two-column-right',
            !hasBg && 'gap-6',
            colIdx === 1 && rightHasMedia && 'order-first md:order-none',
          )

          return (
            <div key={colIdx} className={colClass}>
              {column.map((field, i) => {
                const key = `${colIdx}-${i}`
                const isMediaBlock = field.blockType === 'mediaBlock'
                const child = renderChildField(field, key, true)

                const wrapperClasses = cn(
                  hasBg && !isMediaBlock && 'p-6',
                  colIdx === 1 && isMediaBlock && 'order-first md:order-none',
                )

                return (
                  <div key={key} className={wrapperClasses}>
                    {child}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
