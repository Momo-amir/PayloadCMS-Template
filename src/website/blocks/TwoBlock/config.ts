import { Archive } from '../ArchiveBlock/config'
import { CallToAction } from '../CallToAction/config'
import { Content } from '../Content/config'
import { FormBlock } from '../Form/config'
import { MediaBlock } from '../MediaBlock/config'
import { createColorPaletteField } from '@/cms/fields/colorPalette'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { TwoBlock } from './Component'

export const TwoBlockBlock: ComponentBlock = {
  slug: 'twoBlock',
  component: TwoBlock,
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: 'Two-Column Layout',
    plural: 'Two-Column Layouts',
  },
  fields: [
    createColorPaletteField(),
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
