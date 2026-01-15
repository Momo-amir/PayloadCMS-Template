import React from 'react'
import { cn } from '@/cms/utilities/ui'
import RichText from '@/website/components/RichText'
import { Media } from '@/website/components/Media'
import type { ColumnsBlock as ColumnsBlockProps } from '@/payload-types'

type Props = ColumnsBlockProps & {
  className?: string
}

export const ColumnsBlock: React.FC<Props> = ({ layout, columns, className }) => {
  if (!columns || columns.length === 0) return null

  // Map layout to grid classes
  const layoutClasses = {
    oneTwo: 'md:grid-cols-[1fr_2fr]', // 1/3 - 2/3
    twoOne: 'md:grid-cols-[2fr_1fr]', // 2/3 - 1/3
    half: 'md:grid-cols-2', // 50-50
  }

  return (
    <div className={cn('grid grid-cols-1 gap-8 my-8', layoutClasses[layout || 'half'], className)}>
      {columns.map((column, index) => (
        <div key={column.id || index} className="space-y-4">
          {column.contentType === 'text' && column.content && (
            <RichText data={column.content} enableGutter={false} enableProse />
          )}
          {column.contentType === 'media' && column.media && (
            <Media
              resource={column.media}
              imgClassName="w-full h-auto rounded-[0.8rem]"
              videoClassName="w-full h-auto rounded-[0.8rem]"
            />
          )}
        </div>
      ))}
    </div>
  )
}
