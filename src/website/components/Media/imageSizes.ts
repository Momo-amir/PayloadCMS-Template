import type { Media as MediaType } from '@/payload-types'

const SIZE_MAX_WIDTHS = {
  thumbnail: 300,
  square: 500,
  small: 600,
  medium: 900,
  large: 1400,
  xlarge: 1920,
  '2k': 2560,
  og: 1200,
} as const satisfies Record<keyof NonNullable<MediaType['sizes']>, number>

export type MediaSizePreset = keyof typeof SIZE_MAX_WIDTHS

export const isMediaSizePreset = (value: string): value is MediaSizePreset => value in SIZE_MAX_WIDTHS

export const toImageSizesValue = (size: MediaSizePreset): string => {
  const maxWidth = SIZE_MAX_WIDTHS[size]
  return `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`
}
