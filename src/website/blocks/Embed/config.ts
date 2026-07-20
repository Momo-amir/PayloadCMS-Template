import { ComponentBlock } from '@/website/types/ComponentBlock'
import { EmbedBlock as EmbedBlockComponent } from './Component'

export const EmbedBlock: ComponentBlock = {
  slug: 'embedBlock',
  component: EmbedBlockComponent,
  imageURL: '/assets/block-icons/mediaContent.svg',
  interfaceName: 'EmbedBlock',
  labels: {
    singular: { en: 'Embed', da: 'Indlejring' },
    plural: { en: 'Embeds', da: 'Indlejringer' },
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      label: 'Label',
      admin: {
        description: 'Optional caption shown above the embed (e.g. "Book a demo").',
      },
    },
    {
      name: 'embedType',
      type: 'select',
      label: 'Embed Type',
      defaultValue: 'html',
      options: [{ label: 'Script code snippet', value: 'html' }],
    },
    {
      name: 'html',
      type: 'code',
      label: false,
      required: true,
      admin: {
        language: 'html',
        description: 'Paste the embed HTML/script (e.g. HubSpot, Facebook, Calendly).',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      label: 'Width',
      defaultValue: 'contained',
      options: [
        { label: 'Contained', value: 'contained' },
        { label: 'Full width', value: 'full' },
      ],
    },
  ],
}
