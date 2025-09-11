'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

type BrandingColors = {
  [key: string]: {
    color?: string
    label?: string | null
  }
}

type BrandingGlobal = {
  light?: BrandingColors
  dark?: BrandingColors
}

const ColorPalettePreview: React.FC = () => {
  const [backgroundColor, textColor, enableHover, hoverBackgroundColor, hoverTextColor] =
    useFormFields(([fields]) => [
      fields.backgroundColor?.value as string,
      fields.textColor?.value as string,
      fields.enableHover?.value as boolean,
      fields.hoverBackgroundColor?.value as string,
      fields.hoverTextColor?.value as string,
    ])

  const [brandingColors, setBrandingColors] = useState<BrandingGlobal | null>(null)

  useEffect(() => {
    const fetchBrandingColors = async () => {
      try {
        const response = await fetch('/api/globals/branding', {
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setBrandingColors(data.themeColors)
        }
      } catch (error) {
        console.error('Error fetching branding colors:', error)
      }
    }
    fetchBrandingColors()
  }, [])

  if (!backgroundColor || !textColor || !brandingColors) {
    return (
      <div className="p-4 border border-gray-300 rounded">
        <p className="text-gray-600 text-sm">
          Select both background and text colors to see preview
        </p>
      </div>
    )
  }

  const bgColorData = brandingColors.light?.[backgroundColor as string]
  const textColorData = brandingColors.light?.[textColor as string]
  const bgColorDark = brandingColors.dark?.[backgroundColor as string]
  const textColorDark = brandingColors.dark?.[textColor as string]

  // Get hover color data if enabled
  const hoverBgColorData =
    enableHover && hoverBackgroundColor
      ? brandingColors.light?.[hoverBackgroundColor as string]
      : null
  const hoverTextColorData =
    enableHover && hoverTextColor ? brandingColors.light?.[hoverTextColor as string] : null
  const _hoverBgColorDark =
    enableHover && hoverBackgroundColor
      ? brandingColors.dark?.[hoverBackgroundColor as string]
      : null
  const _hoverTextColorDark =
    enableHover && hoverTextColor ? brandingColors.dark?.[hoverTextColor as string] : null

  if (!bgColorData || !textColorData) {
    return (
      <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Invalid color selection</p>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ padding: '8px', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
        <strong style={{ fontSize: '12px' }}>Color Combination Preview</strong>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Light theme preview */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            backgroundColor: bgColorData.color,
            color: textColorData.color,
          }}
        >
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Light Theme</div>
          <div style={{ fontWeight: 'bold' }}>Sample Text</div>
          <div style={{ fontSize: '14px' }}>This is how your content will look</div>
        </div>

        {/* Dark theme preview */}
        {bgColorDark && textColorDark && (
          <div
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: bgColorDark.color,
              color: textColorDark.color,
            }}
          >
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Dark Theme</div>
            <div style={{ fontWeight: 'bold' }}>Sample Text</div>
            <div style={{ fontSize: '14px' }}>This is how your content will look</div>
          </div>
        )}
      </div>

      {/* Button preview section - separate from color backgrounds */}
      {enableHover && (hoverBgColorData || hoverTextColorData) && (
        <div style={{ padding: '16px', borderTop: '1px solid #ddd', backgroundColor: '#fafafa' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            Hover Effect Demo:
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: bgColorData.color,
                color: textColorData.color,
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={(e) => e.preventDefault()}
              onMouseEnter={(e) => {
                if (hoverBgColorData?.color && hoverTextColorData?.color) {
                  e.currentTarget.style.backgroundColor = hoverBgColorData.color
                  e.currentTarget.style.color = hoverTextColorData.color
                }
              }}
              onMouseLeave={(e) => {
                if (bgColorData.color && textColorData.color) {
                  e.currentTarget.style.backgroundColor = bgColorData.color
                  e.currentTarget.style.color = textColorData.color
                }
              }}
            >
              Light Theme
            </button>
            <span style={{ fontSize: '12px', color: '#666' }}>← Hover for light theme colors</span>

            {/* Dark mode hover button */}
            {bgColorDark && textColorDark && _hoverBgColorDark && _hoverTextColorDark && (
              <>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: bgColorDark.color,
                    color: textColorDark.color,
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginLeft: '20px',
                  }}
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={(e) => {
                    if (_hoverBgColorDark?.color && _hoverTextColorDark?.color) {
                      e.currentTarget.style.backgroundColor = _hoverBgColorDark.color
                      e.currentTarget.style.color = _hoverTextColorDark.color
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (bgColorDark.color && textColorDark.color) {
                      e.currentTarget.style.backgroundColor = bgColorDark.color
                      e.currentTarget.style.color = textColorDark.color
                    }
                  }}
                >
                  Dark Theme
                </button>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  ← Hover for dark theme colors
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '8px', fontSize: '11px', color: '#666', backgroundColor: '#f9f9f9' }}>
        <strong>Generated classes:</strong>{' '}
        <code>
          bg-{backgroundColor} text-{textColor}
          {enableHover &&
            hoverBackgroundColor &&
            hoverTextColor &&
            ` hover:bg-${hoverBackgroundColor} hover:text-${hoverTextColor}`}
        </code>
      </div>
    </div>
  )
}

export default ColorPalettePreview
