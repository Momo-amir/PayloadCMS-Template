import type { Field } from 'payload'

// Static options as fallback (for reference, but now using dynamic component)
export const staticColorPaletteOptions = [
  // Default/None option
  { label: 'Default', value: '' },

  // Theme-based colors (from your CSS variables)
  { label: '--- Theme Colors ---', value: 'theme-separator', disabled: true },
  { label: 'Primary', value: 'bg-primary text-base' },
  { label: 'Secondary', value: 'bg-secondary text-primary' },
  { label: 'Tertiary', value: 'bg-tertiary text-accent2' },
  { label: 'Base', value: 'bg-base text-primary' },
  { label: 'Neutral', value: 'bg-neutral text-primary' },
  { label: 'Accent', value: 'bg-accent text-primary' },
  { label: 'Accent 2', value: 'bg-accent2 text-primary' },
  { label: 'Accent 3', value: 'bg-accent3 text-base' },
]

/**
 * Create a dynamic color palette select field
 * Uses a custom component that loads options dynamically from ColorPalettes collection
 */
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
        Field: '@/cms/components/DynamicColorPaletteField',
      },
      description: customConfig.description,
      ...(customConfig.condition && { condition: customConfig.condition }),
    },
  }
}