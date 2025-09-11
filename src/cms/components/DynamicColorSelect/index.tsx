'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { SelectFieldClientProps } from 'payload'

type ColorPaletteOption = {
  label: string
  value: string
  disabled?: boolean
}

export const DynamicColorPaletteField: React.FC<SelectFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<ColorPaletteOption[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const controlRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const fetchOptions = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch from our utility function via a new API endpoint
      const response = await fetch('/api/color-palette-options', {
        credentials: 'include',
        cache: 'no-store', // Always fetch fresh data
      })

      if (!response.ok) {
        throw new Error('Failed to fetch color palette options')
      }

      const data = await response.json()
      setOptions(data.options || [])
    } catch (error) {
      console.error('Error fetching color palette options:', error)
      // Fallback to basic theme colors
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      const validOptions = options.filter(
        (opt) =>
          !opt.disabled && opt.value !== 'theme-separator' && opt.value !== 'custom-separator',
      )

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          setHighlightedIndex(-1)
          break
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex((prev) => {
            const nextIndex = prev + 1
            return nextIndex >= validOptions.length ? 0 : nextIndex
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex((prev) => {
            const nextIndex = prev - 1
            return nextIndex < 0 ? validOptions.length - 1 : nextIndex
          })
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && validOptions[highlightedIndex]) {
            setValue(validOptions[highlightedIndex].value)
            setIsOpen(false)
            setHighlightedIndex(-1)
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, highlightedIndex, options, setValue])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        controlRef.current &&
        menuRef.current &&
        !controlRef.current.contains(e.target as Node) &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (loading) {
    return (
      <div className="dynamic-color-select-field">
        <div className="field-type">
          <FieldLabel
            htmlFor={`field-${path}`}
            label={typeof field.label === 'string' ? field.label : 'Color Palette'}
          />
          <div className="loading-state">Loading color palettes...</div>
        </div>
      </div>
    )
  }

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="dynamic-color-select-field">
      <div className="field-type">
        <FieldLabel
          htmlFor={`field-${path}`}
          label={typeof field.label === 'string' ? field.label : 'Color Palette'}
        />

        {/* Selected Color Display */}
        {value && (
          <div className="selected-value-display">
            Selected: <code>{value}</code>
          </div>
        )}

        <div className="select-container">
          {/* Custom Select Dropdown */}
          <div className="custom-select-wrapper">
            <div
              ref={controlRef}
              className={`custom-select-control ${isOpen ? 'custom-select-control--is-focused' : ''}`}
              onClick={() => {
                setIsOpen(!isOpen)
                setHighlightedIndex(-1)
              }}
              tabIndex={0}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={`field-${path}-menu`}
              aria-labelledby={`field-${path}-label`}
            >
              <div className="custom-select-value-container">
                <div className="custom-select-single-value">
                  {selectedOption?.label || 'Select color palette...'}
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                ref={menuRef}
                className="custom-select-menu"
                role="listbox"
                id={`field-${path}-menu`}
              >
                <div className="custom-select-menu-list">
                  {options.map((option, index) => {
                    const validOptions = options.filter(
                      (opt) =>
                        !opt.disabled &&
                        opt.value !== 'theme-separator' &&
                        opt.value !== 'custom-separator',
                    )
                    const validIndex = validOptions.findIndex((opt) => opt.value === option.value)
                    const isHighlighted = validIndex === highlightedIndex && validIndex >= 0

                    return (
                      <div
                        key={`${option.value}-${index}`}
                        className={`custom-select-option ${
                          option.disabled ? 'custom-select-option--is-disabled' : ''
                        } ${value === option.value ? 'custom-select-option--is-selected' : ''} ${
                          isHighlighted ? 'custom-select-option--is-highlighted' : ''
                        }`}
                        onClick={() => {
                          if (
                            !option.disabled &&
                            option.value !== 'theme-separator' &&
                            option.value !== 'custom-separator'
                          ) {
                            setValue(option.value)
                            setIsOpen(false)
                            setHighlightedIndex(-1)
                          }
                        }}
                        role="option"
                        aria-selected={value === option.value}
                        data-value={option.value}
                      >
                        {option.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="field-description">
          Choose a color combination. Create custom palettes in the ColorPalettes collection.
        </div>
      </div>
    </div>
  )
}

export default DynamicColorPaletteField
