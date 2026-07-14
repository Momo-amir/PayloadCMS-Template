import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ArchiveBlock as ArchiveBlockComponent } from './Component'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'
import type { CollectionSlug } from 'payload'

// Collections this archive can list. The scaffolder trims entries when a collection is pruned,
// keeping the block collection-agnostic (safe to keep the block without any given collection).
const ARCHIVE_COLLECTIONS: { label: string; value: CollectionSlug }[] = [
  { label: 'Posts', value: 'posts' },
]

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
    // Collection-source fields are present only when at least one collection is available.
    // If the scaffolder trims ARCHIVE_COLLECTIONS to empty, the block stays as a shell to rewire.
    ...(ARCHIVE_COLLECTIONS.length
      ? ([
          {
            name: 'relationTo',
            type: 'select',
            admin: {
              condition: (_, siblingData) => siblingData.populateBy === 'collection',
            },
            defaultValue: ARCHIVE_COLLECTIONS[0]?.value,
            label: 'Collections To Show',
            options: ARCHIVE_COLLECTIONS,
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
            relationTo: ARCHIVE_COLLECTIONS.map((c) => c.value),
          },
        ] as ComponentBlock['fields'])
      : []),
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
