'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { SelectFieldClientProps } from 'payload'

type BrandingColors = {
  [key: string]: {
    color?: string
    label?: string | null
  }
}

type BrandingGlobal = {
  themeColors?: {
    light?: BrandingColors
    dark?: BrandingColors
  }
}

type ColorOption = {
  label: string
  value: string
  lightColor?: string
  darkColor?: string
}

export const BrandingColorSelect: React.FC<SelectFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<ColorOption[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBrandingColors = useCallback(async () => {
    try {
      const response = await fetch('/api/globals/branding', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch branding colors')
      }

      const branding: BrandingGlobal = await response.json()
      const colorOptions: ColorOption[] = []

      // Helper to get display name or fallback
      const getDisplayName = (key: string, colorData?: { label?: string | null }) => {
        return (
          colorData?.label || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        )
      }

      if (branding.themeColors) {
        const { light, dark } = branding.themeColors
        const processedKeys = new Set<string>()

        // Get all unique color keys from both themes
        const allKeys = new Set([
          ...(light ? Object.keys(light) : []),
          ...(dark ? Object.keys(dark) : []),
        ])

        console.log('Found color keys:', Array.from(allKeys)) // Debug log

        allKeys.forEach((key) => {
          if (processedKeys.has(key)) return
          processedKeys.add(key)

          const lightColor = light?.[key]
          const darkColor = dark?.[key]
          const lightLabel = getDisplayName(key, lightColor)
          const darkLabel = getDisplayName(key, darkColor)

          // Create display label showing both themes when different
          let displayLabel = lightLabel
          if (lightColor?.label && darkColor?.label && lightLabel !== darkLabel) {
            displayLabel = `${lightLabel} / ${darkLabel}`
          } else if (!lightColor?.label && darkColor?.label) {
            displayLabel = darkLabel
          }

          // Add only one option per CSS variable
          colorOptions.push({
            label: displayLabel,
            value: key,
            lightColor: lightColor?.color,
            darkColor: darkColor?.color,
          })
        })
      }

      // Sort alphabetically
      colorOptions.sort((a, b) => a.label.localeCompare(b.label))

      setOptions(colorOptions)
    } catch (error) {
      console.error('Error fetching branding colors:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrandingColors()
  }, [fetchBrandingColors])

  if (loading) {
    return (
      <div className="field-type select">
        <label className="field-label">
          {typeof field.label === 'string' ? field.label : 'Color'}
        </label>
        <div style={{ padding: '8px', fontStyle: 'italic', color: '#666' }}>
          Loading branding colors...
        </div>
      </div>
    )
  }

  return (
    <div className="field-type select">
      <label className="field-label">
        {typeof field.label === 'string' ? field.label : 'Color'}
      </label>

      {/* Selected Color Preview */}
      {value && (
        <div
          style={{
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#f9f9f9',
            borderRadius: '6px',
            border: '1px solid #e0e0e0',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Selected:</span>
          {(() => {
            const selectedOption = options.find((opt) => opt.value === value)
            if (selectedOption) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {selectedOption.lightColor && (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: selectedOption.lightColor,
                          border: '2px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                        title={`Light: ${selectedOption.lightColor}`}
                      />
                    )}
                    {selectedOption.darkColor &&
                      selectedOption.darkColor !== selectedOption.lightColor && (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: selectedOption.darkColor,
                            border: '2px solid #ccc',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                          title={`Dark: ${selectedOption.darkColor}`}
                        />
                      )}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {selectedOption.label}
                  </span>
                </div>
              )
            }
            return null
          })()}
        </div>
      )}

      {/* Color Options Grid - Expanded */}
      <div
        style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>
          Choose a color:
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            backgroundColor: '#fafafa',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          {options.map((option, index) => (
            <div
              key={`preview-${option.value}-${index}`}
              onClick={() => setValue(option.value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 12px',
                border: value === option.value ? '2px solid #0066cc' : '1px solid #ddd',
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: value === option.value ? '#f0f8ff' : '#fff',
                transition: 'all 0.2s ease',
                minHeight: '80px',
                boxShadow:
                  value === option.value
                    ? '0 4px 12px rgba(0,102,204,0.15)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa'
                  e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.12)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.backgroundColor = '#fff'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
              title={option.label}
            >
              {/* Color Preview */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '4px',
                }}
              >
                {option.lightColor && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: option.lightColor,
                      border: '2px solid #fff',
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    title={`Light: ${option.lightColor}`}
                  />
                )}
                {option.darkColor && option.darkColor !== option.lightColor && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: option.darkColor,
                      border: '2px solid #fff',
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    title={`Dark: ${option.darkColor}`}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center',
                  color: value === option.value ? '#0066cc' : '#333',
                  lineHeight: '1.3',
                }}
              >
                {option.label}
              </span>

              {/* Selected indicator */}
              {value === option.value && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#0066cc',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default BrandingColorSelect
