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
        { label: 'Dark Blue', value: 'bg-secondary text-white' },
        { label: 'Purple', value: 'bg-tertiary text-accent2' },
        { label: 'Base', value: 'bg-base' },
        { label: 'Yellow', value: 'bg-highlight text-accent3' },
        { label: 'Peach', value: 'bg-highlight2 text-accent3' },
        { label: 'Light blue', value: 'bg-accent text-secondary' },
        { label: 'Light purple', value: 'bg-accent2 text-tertiary' },
        { label: 'Orange', value: 'bg-accent3 text-highlight2' },
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
