import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import type { ColorPalette } from '@/payload-types'

// Cache for color palettes to avoid repeated database queries
let colorPalettesCache: ColorPalette[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 60000 // 1 minute cache

/**
 * Fetch all color palettes from the database
 */
export async function getColorPalettes(): Promise<ColorPalette[]> {
  const now = Date.now()

  // Return cached data if it's still fresh
  if (colorPalettesCache && now - cacheTimestamp < CACHE_DURATION) {
    return colorPalettesCache
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'colorPalettes',
      limit: 100,
      sort: 'name',
    })

    colorPalettesCache = result.docs
    cacheTimestamp = now
    return result.docs
  } catch (error) {
    console.error('Error fetching color palettes:', error)
    return []
  }
}

/**
 * Get color palette options for Payload select fields
 * Now returns the auto-generated CSS class values from the ColorPalettes collection
 */
export async function getColorPaletteOptions() {
  const palettes = await getColorPalettes()

  const options = [
    { label: 'Default', value: '' }, // Keep default option
  ]

  // Add custom palettes from the collection
  if (palettes.length > 0) {
    palettes.forEach((palette) => {
      if (palette.value) {
        options.push({
          label: palette.name,
          value: palette.value, // This is the auto-generated "bg-{color} text-{color}" value
        })
      }
    })
  }

  return options
}

/**
 * Clear the color palettes cache (useful for hooks)
 */
export function clearColorPalettesCache(): void {
  colorPalettesCache = null
  cacheTimestamp = 0
}

// Clear cache on module load to ensure fresh data
clearColorPalettesCache()
