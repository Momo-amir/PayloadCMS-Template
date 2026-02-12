import { ComponentBlock } from '@/website/types/ComponentBlock'
import { PromoStripComponent } from './Component'

export const PromoStripBlock: ComponentBlock = {
  slug: 'PromoStrip',
  component: PromoStripComponent,
  interfaceName: 'PromoStripBlock',
  imageURL: '/assets/block-icons/promo-strip.svg',

  showOnPage: true,
  fields: [
    {
      name: 'usps', // unique selling points
      type: 'array',
      fields: [
        {
          name: 'text',
          localized: true,
          type: 'text',
          required: true,
        },
        {
          name: 'icon', // This should be optional. It is to show fa-icons before the text
          type: 'text',
          required: false,
          admin: {
            description: 'Font Awesome icon class (e.g., "fa-solid fa-star")',
          },
        },
      ],
    },
  ],
}
