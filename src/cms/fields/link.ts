import type { Field, GroupField } from 'payload'

import deepMerge from '@/cms/utilities/deepMerge'
import { createColorPaletteField } from './colorPalette'

export type LinkAppearances = 'default' | 'outline' | 'link'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },

  link: {
    label: 'Link',
    value: 'link',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages', 'posts'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    // Add checkbox to enable custom color theme
    linkResult.fields.push({
      name: 'useCustomColorTheme',
      type: 'checkbox',
      label: 'Use Custom Color Theme',
      admin: {
        description: 'Enable this to use a custom color palette instead of appearance options.',
      },
      defaultValue: false,
    })

    // Appearance field - shown by default, hidden when custom color theme is enabled
    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
        condition: (_, siblingData) => !siblingData?.useCustomColorTheme,
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })

    // Add color palette field for styling links/buttons - only shown when checkbox is enabled
    linkResult.fields.push(
      createColorPaletteField({
        name: 'colorPalette',
        label: 'Color Theme',
        description: 'Choose a color theme for this link/button.',
        condition: (_, siblingData) => siblingData?.useCustomColorTheme === true,
      }),
    )
  }

  return deepMerge(linkResult, overrides)
}
