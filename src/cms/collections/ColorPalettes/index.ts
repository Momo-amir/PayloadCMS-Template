import type { CollectionConfig } from 'payload'
import { clearColorPalettesCache } from '@/cms/utilities/colorPalettes'

export const ColorPalettes: CollectionConfig = {
  slug: 'colorPalettes',
  labels: {
    singular: 'Color Palette',
    plural: 'Color Palettes',
  },
  admin: {
    useAsTitle: 'name',
    description: 'Create reusable color combinations using your branding colors',
    defaultColumns: ['name', 'value', 'backgroundColor', 'textColor', 'enableHover'],
    listSearchableFields: ['name', 'description'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Palette Name',
      required: true,
      admin: {
        description:
          'Friendly name for this color combination (e.g., "Brand Primary", "Call to Action")',
      },
    },
    {
      name: 'value',
      type: 'text',
      label: 'Generated CSS Classes',
      admin: {
        readOnly: true,
        description: 'Auto-generated CSS classes based on your color selection',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Background Color',
          required: true,
          admin: {
            width: '50%',
            components: {
              Field: '@/cms/components/BrandingColorPickerField',
            },
            description: 'Choose from your branding colors',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          label: 'Text Color',
          required: true,
          admin: {
            width: '50%',
            components: {
              Field: '@/cms/components/BrandingColorPickerField',
            },
            description: 'Choose from your branding colors',
          },
        },
      ],
    },
    {
      name: 'enableHover',
      type: 'checkbox',
      label: 'Hover',
      defaultValue: false,
      admin: {
        description: 'Add hover state colors for interactive elements like buttons',
      },
    },
    {
      type: 'row',
      admin: {
        condition: (data) => data?.enableHover === true,
      },
      fields: [
        {
          name: 'hoverBackgroundColor',
          type: 'text',
          label: '🎨 Hover Background Color',
          admin: {
            width: '50%',
            components: {
              Field: '@/cms/components/BrandingColorPickerField',
            },
            description: 'Background color on hover',
          },
        },
        {
          name: 'hoverTextColor',
          type: 'text',
          label: '📝 Hover Text Color',
          admin: {
            width: '50%',
            components: {
              Field: '@/cms/components/BrandingColorPickerField',
            },
            description: 'Text color on hover',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Usage Description',
      admin: {
        description: 'Optional notes about when/how to use this color palette',
        placeholder: 'e.g., "Use for call-to-action buttons and important highlights"',
      },
    },
    {
      name: 'preview',
      type: 'ui',
      label: 'Color Preview',
      admin: {
        components: {
          Field: '@/cms/components/ColorPalettePreview',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Generate the CSS classes value from the selected colors
        if (data.backgroundColor && data.textColor) {
          let value = `bg-${data.backgroundColor} text-${data.textColor}`

          // Add hover classes if enabled and hover colors are selected
          if (data.enableHover && data.hoverBackgroundColor && data.hoverTextColor) {
            value += ` hover:bg-${data.hoverBackgroundColor} hover:text-${data.hoverTextColor}`
          }

          data.value = value
        }
        return data
      },
    ],
    afterChange: [
      () => {
        clearColorPalettesCache()
      },
    ],
    afterDelete: [
      () => {
        clearColorPalettesCache()
      },
    ],
  },
}
