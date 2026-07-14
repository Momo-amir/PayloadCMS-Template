import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ArchiveBlock as ArchiveBlockComponent } from './Component'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'

export const ArchiveBlock: ComponentBlock = {
  slug: 'archiveBlock',
  component: ArchiveBlockComponent,
  imageURL: '/assets/block-icons/archive.svg',
  interfaceName: 'ArchiveBlock',
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
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 'posts',
      label: 'Collections To Show',
      options: [
        {
          label: 'Posts',
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      localized: true,
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: ['posts'],
    },
    {
      name: 'enableCategoryFilter',
      type: 'checkbox',
      label: 'Enable category tag filtering',
      defaultValue: false,
    },
    {
      name: 'enablePagination',
      type: 'checkbox',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      label: 'Enable pagination',
      defaultValue: false,
    },
  ],
  labels: {
    plural: 'Archives',
    singular: 'Archive',
  },
}
