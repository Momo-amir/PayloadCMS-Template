'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { TextInput, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

interface ColorPickerInputProps extends TextFieldClientProps {
  label?: string
}

const ColorPickerInput: React.FC<ColorPickerInputProps> = (props) => {
  const { path, field, label } = props
  const { value, setValue } = useField<string>({ path: path || field.name })
  const [isValidColor, setIsValidColor] = useState(true)
  const [pickerValue, setPickerValue] = useState('')
  const [isPickerActive, setIsPickerActive] = useState(false)

  // Validate color format using CSS.supports (more reliable and no DOM manipulation)
  const validateColor = useCallback((color: string) => {
    if (!color || color.trim() === '') return true

    // Check common color formats without DOM manipulation
    if (
      /^#([0-9A-F]{3}){1,2}$/i.test(color) || // hex
      /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.test(color) || // rgb
      /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i.test(color) || // rgba
      /^hsl\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/i.test(color) || // hsl
      /^hsla\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*([\d.]+)\s*\)$/i.test(color) || // hsla
      CSS.supports('color', color) // Use CSS.supports for named colors and other formats
    ) {
      return true
    }

    return false
  }, [])

  // Convert color to hex for the color picker input
  const getHexColor = useCallback((color: string): string => {
    if (!color) return '#ffffff'

    // If it's already a valid hex, return it
    if (/^#[0-9A-F]{6}$/i.test(color)) return color
    if (/^#[0-9A-F]{3}$/i.test(color)) {
      // Convert 3-digit hex to 6-digit
      return (
        '#' +
        color
          .slice(1)
          .split('')
          .map((c) => c + c)
          .join('')
      )
    }

    // For non-hex colors, return a default hex that the picker can use
    return '#ffffff'
  }, [])

  useEffect(() => {
    if (!isPickerActive) {
      setPickerValue(getHexColor(value || ''))
    }
    const isValid = validateColor(value || '')
    setIsValidColor(isValid)
  }, [value, getHexColor, validateColor, isPickerActive])

  // Handle color picker interaction start
  const handlePickerFocus = useCallback(() => {
    setIsPickerActive(true)
  }, [])

  // Handle color picker change - only updates local state during interaction
  const handleColorPickerChange = useCallback((hexColor: string) => {
    setPickerValue(hexColor)
  }, [])

  // Handle color picker interaction end - commits the value
  const handlePickerBlur = useCallback(() => {
    setIsPickerActive(false)
    // Only update the field value if the picker value is different
    if (pickerValue !== getHexColor(value || '')) {
      setValue(pickerValue)
    }
  }, [pickerValue, value, setValue, getHexColor])

  // Handle text input change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      // Update picker value to match if it's a valid hex
      if (validateColor(newValue)) {
        setPickerValue(getHexColor(newValue))
      }
    },
    [setValue, validateColor, getHexColor],
  )

  return (
    <div className="color-picker-field">
      <label className="color-picker-label">
        {label || (typeof field.label === 'string' ? field.label : 'Color Picker')}
      </label>
      <div className="color-picker-container">
        <div className="color-picker-text-input">
          <TextInput
            {...props}
            value={value || ''}
            onChange={handleTextChange}
            className={!isValidColor ? 'color-picker-invalid' : ''}
          />
        </div>
        <div className="color-picker-controls">
          <div className="color-picker-inputs">
            {/* Color picker input - smart state management */}
            <input
              type="color"
              value={pickerValue}
              onChange={(e) => handleColorPickerChange(e.target.value)}
              onFocus={handlePickerFocus}
              onBlur={handlePickerBlur}
              className="color-picker-input color-picker-input-large"
              title="Click to open color picker"
            />
          </div>
        </div>
      </div>
      {!isValidColor && (
        <div className="color-picker-error">
          Please enter a valid CSS color (hex, rgb, hsl, or color name)
        </div>
      )}
      {field?.admin?.description && typeof field.admin.description === 'string' && (
        <div className="color-picker-description">{field.admin.description}</div>
      )}
    </div>
  )
}

export default ColorPickerInput
