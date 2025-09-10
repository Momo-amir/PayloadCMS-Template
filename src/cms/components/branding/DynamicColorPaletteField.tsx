'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useField } from '@payloadcms/ui'
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
      setOptions([
        { label: 'Default', value: '' },
        { label: '--- Theme Colors ---', value: 'theme-separator', disabled: true },
        { label: 'Primary', value: 'bg-primary text-base' },
        { label: 'Secondary', value: 'bg-secondary text-primary' },
        { label: 'Tertiary', value: 'bg-tertiary text-accent2' },
        { label: 'Base', value: 'bg-base text-primary' },
        { label: 'Neutral', value: 'bg-neutral text-primary' },
        { label: 'Accent', value: 'bg-accent text-primary' },
        { label: 'Accent 2', value: 'bg-accent2 text-primary' },
        { label: 'Accent 3', value: 'bg-accent3 text-base' },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  if (loading) {
    return (
      <div className="field-type select">
        <label className="field-label">
          {typeof field.label === 'string' ? field.label : 'Color Palette'}
        </label>
        <div style={{ padding: '8px', fontStyle: 'italic', color: '#666' }}>
          Loading color palettes...
        </div>
      </div>
    )
  }

  return (
    <div className="field-type select">
      <label className="field-label">
        {typeof field.label === 'string' ? field.label : 'Color Palette'}
      </label>

      {/* Selected Color Display */}
      {value && (
        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          Selected:{' '}
          <code style={{ backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '2px' }}>
            {value}
          </code>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <select
          value={value || ''}
          onChange={(e) => {
            // Don't allow selecting disabled options
            if (e.target.value !== 'theme-separator' && e.target.value !== 'custom-separator') {
              setValue(e.target.value)
            }
          }}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {options.map((option, index) => (
            <option
              key={`${option.value}-${index}`}
              value={option.value}
              disabled={option.disabled}
              style={{
                fontStyle: option.disabled ? 'italic' : 'normal',
                backgroundColor: option.disabled ? '#f5f5f5' : 'white',
              }}
            >
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={fetchOptions}
          disabled={loading}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f8f9fa',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px',
          }}
          title="Refresh color palette options"
        >
          {loading ? '↻' : '⟳'}
        </button>
      </div>

      <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
        Choose a color combination. Create custom palettes in the ColorPalettes collection.
      </div>
    </div>
  )
}

export default DynamicColorPaletteField
