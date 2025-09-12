import { ComponentBlock } from '@/website/types/ComponentBlock'
import { MediaBlock as MediaBlockComponent } from './Component'

export const MediaBlock: ComponentBlock = {
  slug: 'mediaBlock',
  component: MediaBlockComponent,
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
