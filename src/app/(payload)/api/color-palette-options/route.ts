import { NextRequest, NextResponse } from 'next/server'
import { getColorPaletteOptions } from '@/cms/utilities/colorPalettes'

export async function GET(_request: NextRequest) {
  try {
    const options = await getColorPaletteOptions()
    return NextResponse.json({ options })
  } catch (error) {
    console.error('Error fetching color palette options:', error)
    return NextResponse.json({ error: 'Failed to fetch color palette options' }, { status: 500 })
  }
}
