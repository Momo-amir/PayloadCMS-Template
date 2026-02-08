import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/cms/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  localized: true,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Search Hero',
          value: 'search',
        },
      ],
      required: true,
    },
    {
      type: 'group',
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'dark',
          options: [
            {
              label: 'Black text',
              value: 'light',
            },
            {
              label: 'White text',
              value: 'dark',
            },
          ],
          admin: {
            condition: (_, { type } = {}) => ['highImpact'].includes(type),
          },
          required: true,
        },
        {
          name: 'centered',
          type: 'checkbox',
          label: 'Centered Content',
          defaultValue: 'false',
          admin: {
            condition: (_, { type } = {}) => ['highImpact'].includes(type),
          },
          required: true,
        },
      ],
    },

    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => type !== 'search',
        },
      },
    }),
    {
      name: 'searchPathMode',
      type: 'select',
      label: 'Search Path',
      defaultValue: 'current',
      options: [
        { label: 'Use current page path', value: 'current' },
        { label: 'Select a page', value: 'select' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'search',
      },
      required: true,
    },
    {
      name: 'searchPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Search Page',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'search' && siblingData?.searchPathMode === 'select',
      },
      validate: (value, { siblingData }) => {
        if (siblingData?.type === 'search' && siblingData?.searchPathMode === 'select' && !value) {
          return 'Select a page for the Search Path.'
        }
        return true
      },
    },
    {
      name: 'resultsPerPage',
      type: 'number',
      label: 'Results per page',
      defaultValue: 12,
      min: 1,
      admin: {
        condition: (_, { type } = {}) => type === 'search',
      },
    },
    {
      name: 'resultCollection',
      type: 'select',
      label: 'Results Type',
      defaultValue: 'posts',
      options: [
        { label: 'Posts', value: 'posts' },
        { label: 'People', value: 'people' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'search',
      },
    },
    {
      name: 'postCategories',
      localized: true,
      type: 'relationship',
      hasMany: true,
      label: 'Post Categories Filter',
      relationTo: 'categories',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'search' && siblingData?.resultCollection === 'posts',
        description: 'Only used when Results Type is Posts.',
      },
    },
    {
      name: 'emptyText',
      type: 'text',
      label: 'Empty State Text',
      localized: true,
      admin: {
        condition: (_, { type } = {}) => type === 'search',
      },
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
