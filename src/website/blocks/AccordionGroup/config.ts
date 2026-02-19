import type { Field } from 'payload'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { AccordionGroup } from './Component'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'

export const AccordionGroupBlock: ComponentBlock = {
  slug: 'AccordionGroup',
  component: AccordionGroup,
  interfaceName: 'AccordionGroupBlock',
  showOnPage: true,
  fields: [
    {
      name: 'singleOpen',
      type: 'checkbox',
      label: 'Only allow one accordion open at a time',
      defaultValue: false,
    },
    {
      name: 'accordions',
      type: "array",
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
                HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        }
      ],
    }
  ],
}