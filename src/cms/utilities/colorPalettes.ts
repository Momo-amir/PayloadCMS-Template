// Color palettes were removed in favor of built-in variants.
// Keep minimal stubs so existing UI and routes continue to work.

export async function getColorPalettes(): Promise<any[]> {
  return []
}

export async function getColorPaletteOptions() {
  return [{ label: 'Default', value: '' }]
}

export function clearColorPalettesCache(): void {
  // no-op
}
