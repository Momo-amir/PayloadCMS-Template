import { ComponentBlock } from '@/website/types/ComponentBlock'
import { RichTextBlock as RichTextBlockComponent } from './Component'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'
import { linkGroup } from '@/cms/fields/linkGroup'

export const RichTextBlock: ComponentBlock = {
  slug: 'richTextBlock',
  component: RichTextBlockComponent,
  interfaceName: 'RichTextBlock',
  imageURL: '/assets/block-icons/Content.svg',

  showOnPage: false, // Only available in TwoColumnBlock
  labels: {
    singular: { en: 'Content Section', da: 'Indholdssektion' },
    plural: { en: 'Content Sections', da: 'Indholdssektioner' },
  },
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
    },
    linkGroup({
      appearances: ['default', 'outline', 'link', 'secondary', 'tertiary'],
      overrides: {
        maxRows: 3,
      },
    }),
  ],
}
