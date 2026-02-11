import type { Field } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '@/cms/fields/link'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { ContentBlock } from './Component'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'full',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
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
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: ComponentBlock = {
  slug: 'content',
  component: ContentBlock,
  imageURL: '/assets/block-icons/Content.svg',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'section',
      label: 'Content Section',
      type: 'array',
      admin: {
        initCollapsed: false,
      },
      fields: columnFields,
    },
  ],
}
