import { Block } from 'payload'
import { FC } from 'react'

export interface ComponentBlock extends Block {
  /**
   * Determines if this block is selectable on a Page collection.
   */
  showOnPage?: boolean
  /**
   * The functional React component to render for this block.
   */
  component: FC<any>
  /**
   * Path to the icon/image displayed in the admin UI for this block.
   */
  imageURL?: string
}
