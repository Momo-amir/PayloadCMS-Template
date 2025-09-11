import type { Field } from 'payload'

// Static options as fallback (for reference, but now using dynamic component)
export const staticColorPaletteOptions = [
  // Default/None option
  { label: 'Default', value: '' },
]

export const createColorPaletteField = (
  customConfig: {
    name?: string
    label?: string
    description?: string
    condition?: (data: Record<string, unknown>, siblingData: Record<string, unknown>) => boolean
  } = {},
): Field => {
  return {
    name: customConfig.name || 'backgroundColor',
    type: 'text', // Using text field with custom component
    label: customConfig.label || 'Color Palette',
    defaultValue: '',
    admin: {
      components: {
        Field: '@/cms/components/DynamicColorSelect',
      },
      description: customConfig.description,
      ...(customConfig.condition && { condition: customConfig.condition }),
    },
  }
}
