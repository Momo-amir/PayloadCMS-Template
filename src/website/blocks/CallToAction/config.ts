import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'

import { linkGroup } from '@/cms/fields/linkGroup'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { CallToActionBlock } from './Component'

export const CallToAction: ComponentBlock = {
  slug: 'cta',
  component: CallToActionBlock,
  imageURL: '/assets/block-icons/input-spark.svg',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      localized: true,
      type: 'richText',
      defaultValue: EMPTY_LEXICAL_CONTENT,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      appearances: ['default', 'outline', 'link', 'secondary', 'tertiary'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'centered',
      type: 'checkbox',
      label: 'Center Content',
      defaultValue: false,
    },
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
