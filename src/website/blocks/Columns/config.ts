import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { ColumnsBlock } from './Component'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'

export const Columns: ComponentBlock = {
  slug: 'columns',
  component: ColumnsBlock,
  imageURL: '/assets/block-icons/layout-columns.svg',
  interfaceName: 'ColumnsBlock',
  showOnPage: false,
  labels: {
    singular: 'Columns Layout',
    plural: 'Columns Layouts',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'half',
      options: [
        {
          label: '50 / 50',
          value: 'half',
        },
        {
          label: '33 / 66',
          value: 'oneTwo',
        },
        {
          label: '66 / 33',
          value: 'twoOne',
        },
      ],
      admin: {
        description: 'Choose the column width ratio for desktop view',
      },
    },
    {
      name: 'columns',
      type: 'array',
      minRows: 2,
      maxRows: 2,
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      fields: [
        {
          name: 'contentType',
          type: 'radio',
          defaultValue: 'text',
          options: [
            {
              label: 'Text',
              value: 'text',
            },
            {
              label: 'Media',
              value: 'media',
            },
          ],
          admin: {
            layout: 'horizontal',
            description: 'Choose whether this column contains text or media',
          },
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
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
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'text',
          },
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'media',
          },
        },
      ],
    },
  ],
}
