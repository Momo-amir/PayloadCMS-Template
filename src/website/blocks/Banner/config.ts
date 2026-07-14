import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { BannerBlock as BannerBlockComponent } from './Component'

export const BannerBlock: ComponentBlock = {
  slug: 'bannerBlock',
  component: BannerBlockComponent,
  showOnPage: false,
  labels: {
    singular: { en: 'Banner', da: 'Banner' },
    plural: { en: 'Banners', da: 'Bannerer' },
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      localized: true,
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
