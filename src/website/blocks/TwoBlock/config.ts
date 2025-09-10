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
      name: 'backgroundColor',
      type: 'select',
      label: 'Color Palette',
      defaultValue: '',
      options: [
        { label: 'None', value: '' },
        { label: 'Primary', value: 'bg-primary text-base' },
        { label: 'Secondary', value: 'bg-secondary text-primary' },
        { label: 'Tertiary', value: 'bg-tertiary text-accent2' },
        { label: 'Base', value: 'bg-base text-primary' },
        { label: 'Neutral', value: 'bg-neutral text-primary' },
        { label: 'Accent', value: 'bg-accent text-primary' },
        { label: 'Accent 2', value: 'bg-accent2 text-primary' },
        { label: 'Accent 3', value: 'bg-accent3 text-base' },
      ],
      admin: {
        isClearable: false,
      },
    },
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
