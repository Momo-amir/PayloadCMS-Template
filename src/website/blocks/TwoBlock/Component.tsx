import React from 'react'
import { renderChildField, TwoBlockField } from './fields'

export const TwoBlock: React.FC<{
  left?: TwoBlockField[]
  right?: TwoBlockField[]
}> = ({ left = [], right = [] }) => (
  <div className="grid md:grid-cols-12 gap-x-8 items-center">
    {[left, right].map((column, colIdx) => (
      <div
        key={colIdx}
        className={colIdx === 0 ? 'md:col-span-3 md:col-start-4' : 'md:col-span-3 md:col-start-7'}
      >
        {column.map((field, i) => renderChildField(field, `${colIdx}-${i}`))}
      </div>
    ))}
  </div>
)
