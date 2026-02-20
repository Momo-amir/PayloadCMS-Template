import { ComponentBlock } from '@/website/types/ComponentBlock'
import { AccordionBlockComponent } from './Component'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'

export const AccordionBlock: ComponentBlock = {
  slug: 'Accordion',
  component: AccordionBlockComponent,
  interfaceName: 'AccordionBlock',
  showOnPage: true,
  imageURL: '/assets/block-icons/accordion.svg',
  fields: [
    {
      name: 'introContent',
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
      label: 'Intro Content',
    },
    {
      name: 'sideBySideWithIntro',
      type: 'checkbox',
      label: 'Show intro and accordions side by side on desktop',
      defaultValue: false,
    },
    {
      name: 'singleOpen',
      type: 'checkbox',
      label: 'Only allow one accordion open at a time',
      defaultValue: false,
    },
    {
      name: 'accordions',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'content',
          localized: true,
          type: 'richText',
          defaultValue: EMPTY_LEXICAL_CONTENT,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        },
      ],
    },
  ],
}
