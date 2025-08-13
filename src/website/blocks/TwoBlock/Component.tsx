import React from 'react'
import { renderChildField, TwoBlockField } from './fields'

export const TwoBlock: React.FC<{
  left?: TwoBlockField[]
  right?: TwoBlockField[]
  backgroundColor?: string
}> = ({ left = [], right = [], backgroundColor }) => {
  const hasBg = Boolean(backgroundColor)
  const gridClasses = [
    'grid grid-cols-1 md:grid-cols-2 gap-x-8 items-center',
    backgroundColor,
    hasBg ? 'two-background-spacing' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="container">
      <div className={gridClasses}>
        {[left, right].map((column, colIdx) => {
          const colClass = [
            'two-column-layout',
            colIdx === 0 ? 'two-column-left' : 'two-column-right',
          ].join(' ')
          return (
            <div key={colIdx} className={colClass}>
              {column.map((field, i) => renderChildField(field, `${colIdx}-${i}`, true))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
