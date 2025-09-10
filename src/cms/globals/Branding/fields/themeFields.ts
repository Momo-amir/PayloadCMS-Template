import { Field } from 'payload'
import {
  defaultTheme,
  getThemeVariableNames,
  type ThemeMode,
} from '../../../../providers/Theme/InitTheme/defaultTheme'

// Helper to create theme color fields for a specific mode
export const createThemeColorFields = (mode: ThemeMode): Field[] => {
  const themeValues = defaultTheme[mode]
  const variableNames = getThemeVariableNames()

  return variableNames.map(
    (key): Field => ({
      name: key,
      type: 'group',
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      admin: {
        width: '50%',
      },
      fields: [
        {
          name: 'color',
          type: 'text',
          label: 'Color Value',
          defaultValue: themeValues[key],
          admin: {
            width: '50%',
            description: `Default: ${themeValues[key]}. Accepts hex, rgb, hsl, or CSS color names.`,
            components: {
              Field: '@/cms/components/ColorPickerField',
            },
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Name',
          admin: {
            width: '50%',
            placeholder: `e.g., "Brand Blue", "Call to Action"`,
            description: 'Optional friendly name for this color (for your reference only)',
          },
        },
      ],
    }),
  )
}

// Helper to create the complete theme colors group field
export const createThemeColorsGroup = (): Field => ({
  name: 'themeColors',
  label: 'Theme Colors',
  type: 'group',
  admin: {
    description:
      'Customize the theme colors for light and dark modes. You are able to change colors for both themes independently. Leaving a field empty will revert it to the default color.',
  },
  fields: [
    {
      name: 'enableCustomColors',
      label: 'Enable Custom Color Editing',
      type: 'checkbox',
      admin: {
        description: 'Enable this to show color editing fields for light and dark themes.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'light',
          label: 'Light Palette',
          type: 'group',
          admin: {
            width: '50%',
            condition: (data) => data?.themeColors?.enableCustomColors === true,
          },
          fields: createThemeColorFields('light'),
        },
        {
          name: 'dark',
          label: 'Dark Palette',
          type: 'group',
          admin: {
            width: '50%',
            condition: (data) => data?.themeColors?.enableCustomColors === true,
          },
          fields: createThemeColorFields('dark'),
        },
      ],
    },
  ],
})
