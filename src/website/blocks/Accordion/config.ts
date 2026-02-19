import type { Field } from 'payload'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { Accordion } from './Component'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'


export const AccordionBlock: ComponentBlock = {
  slug: 'Accordion',
  component: Accordion,
  interfaceName: 'AccordionBlock',
  showOnPage: false,
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