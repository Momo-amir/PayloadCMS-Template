import React from 'react'
import { renderChildField, TwoBlockField } from './fields'

export const TwoBlock: React.FC<{
  left?: TwoBlockField[]
  right?: TwoBlockField[]
}> = ({ left = [], right = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-center container">
    {[left, right].map((column, colIdx) => (
      <div key={colIdx}>
        {column.map((field, i) => renderChildField(field, `${colIdx}-${i}`, true))}
      </div>
    ))}
  </div>
)
