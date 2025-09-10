'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { TextInput, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

const ColorPickerField: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path: path || field.name })
  const [isValidColor, setIsValidColor] = useState(true)

  // Validate color format
  const validateColor = useCallback((color: string) => {
    if (!color || color.trim() === '') return true

    // Test if it's a valid CSS color by creating a temporary element
    const tempEl = document.createElement('div')
    tempEl.style.color = color
    const isValid = tempEl.style.color !== ''

    return isValid
  }, [])

  // Update validation state when value changes
  useEffect(() => {
    setIsValidColor(validateColor(value || ''))
  }, [value, validateColor])

  // Convert any valid color to hex for the color input
  const getHexColor = useCallback((color: string): string => {
    if (!color) return '#ffffff'

    // If it's already hex, return it
    if (/^#[0-9A-F]{6}$/i.test(color)) return color

    // Convert other formats to hex
    const tempEl = document.createElement('div')
    tempEl.style.color = color
    document.body.appendChild(tempEl)
    const computedColor = window.getComputedStyle(tempEl).color
    document.body.removeChild(tempEl)

    // Parse rgb() format
    const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch
      return `#${[r, g, b]
        .map((x) => {
          const parsed = parseInt(x || '0')
          return parsed.toString(16).padStart(2, '0')
        })
        .join('')}`
    }

    return '#ffffff'
  }, [])

  // Handle color picker change
  const handleColorChange = useCallback(
    (hexColor: string) => {
      setValue(hexColor)
    },
    [setValue],
  )

  // Handle text input change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    [setValue],
  )

  return (
    <div className="color-picker-field">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <TextInput
            {...props}
            value={value || ''}
            onChange={handleTextChange}
            className={!isValidColor ? 'borderborder-red-500' : ''}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <label className="text-xs text-gray-600">Preview</label>
          <div className="flex gap-1">
            {/* Color preview box */}
            <div
              className="w-8 h-8 "
              style={{
                backgroundColor: isValidColor && value ? value : '#ffffff',
                opacity: isValidColor ? 1 : 0.3,
              }}
              title={value || 'No color set'}
            />
            {/* Color picker input */}
            <input
              type="color"
              value={getHexColor(value || '')}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8  rounded cursor-pointer border-hidden color-picker-input"
              title="Click to open color picker"
              style={{ padding: 0, border: 'none' }}
            />
          </div>
        </div>
      </div>
      {!isValidColor && (
        <div className="text-red-500 text-xs mt-1">
          Please enter a valid CSS color (hex, rgb, hsl, or color name)
        </div>
      )}
      {field?.admin?.description && typeof field.admin.description === 'string' && (
        <div className="text-gray-600 text-xs mt-1">{field.admin.description}</div>
      )}
    </div>
  )
}

export default ColorPickerField
