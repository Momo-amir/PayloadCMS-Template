import type { Block } from 'payload'
import { Archive } from '../ArchiveBlock/config'
import { CallToAction } from '../CallToAction/config'
import { Content } from '../Content/config'
import { FormBlock } from '../Form/config'
import { MediaBlock } from '../MediaBlock/config'

export const TwoBlock: Block = {
  slug: 'twoBlock',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: 'Two-Column Layout',
    plural: 'Two-Column Layouts',
  },
  fields: [
    {
      name: 'left',
      type: 'blocks',
      blocks: [Archive, CallToAction, Content, FormBlock, MediaBlock],
      label: 'Left Column',
    },
    {
      name: 'right',
      type: 'blocks',
      blocks: [Archive, CallToAction, Content, FormBlock, MediaBlock],
      label: 'Right Column',
    },
  ],
}
