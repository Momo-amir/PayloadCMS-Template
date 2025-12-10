import { ComponentBlock } from '@/website/types/ComponentBlock'
import { RichTextBlock } from './Component'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'
import { linkGroup } from '@/cms/fields/linkGroup'

export const RichTextBlockBlock: ComponentBlock = {
  slug: 'richTextBlock',
  component: RichTextBlock,
  interfaceName: 'RichTextBlockBlock',
  showOnPage: false, // Only available in TwoBlock
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'richText',
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
    },
    linkGroup({
      appearances: ['default', 'outline', 'link', 'secondary', 'tertiary'],
      overrides: {
        maxRows: 3,
      },
    }),
  ],
}
