import type { CSSProperties } from 'react'

export const STAGGER_GRID_CLASS = 'archive-stagger-grid'
export const STAGGER_ITEM_CLASS = 'archive-stagger-item'

export const getStaggerItemProps = (
  index: number,
  enabled = true,
): { className?: string; style?: CSSProperties } => {
  if (!enabled) return {}

  return {
    className: STAGGER_ITEM_CLASS,
    style: { '--archive-stagger-index': index } as CSSProperties,
  }
}
