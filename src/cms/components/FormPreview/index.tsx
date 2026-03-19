'use client'

import React from 'react'
import { useAllFormFields, useTranslation } from '@payloadcms/ui'

// Shared styles using only Payload admin CSS variables — available in both light and dark themes
const s = {
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
    color: 'var(--theme-text)',
  } satisfies React.CSSProperties,

  required: {
    color: 'var(--theme-error-500)',
    marginLeft: '0.15rem',
  } satisfies React.CSSProperties,

  input: {
    display: 'flex',
    height: '2.5rem',
    width: '100%',
    borderRadius: '0.25rem',
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-0)',
    padding: '0 0.75rem',
    fontSize: '0.875rem',
    color: 'var(--theme-text)',
    opacity: 0.7,
    boxSizing: 'border-box' as const,
  } satisfies React.CSSProperties,

  textarea: {
    display: 'flex',
    minHeight: '5rem',
    width: '100%',
    borderRadius: '0.25rem',
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-0)',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    color: 'var(--theme-text)',
    opacity: 0.7,
    boxSizing: 'border-box' as const,
    resize: 'none' as const,
  } satisfies React.CSSProperties,

  checkbox: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    borderRadius: '0.2rem',
    border: '1px solid var(--theme-elevation-300)',
    background: 'var(--theme-elevation-0)',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } satisfies React.CSSProperties,

  checkboxLabel: {
    fontSize: '0.875rem',
    color: 'var(--theme-text)',
  } satisfies React.CSSProperties,
} as const

type FieldPreviewProps = {
  blockType: string
  label?: unknown
  required?: unknown
  width?: unknown
  options?: { label: string; value: string }[]
  linkLabel?: unknown
  [key: string]: unknown
}

function FieldPreview({
  blockType,
  label,
  required,
  width,
  options,
  linkLabel,
}: FieldPreviewProps) {
  const labelStr = typeof label === 'string' ? label : undefined
  const isRequired = Boolean(required)
  const widthPct = typeof width === 'number' ? width : undefined

  const pct = widthPct ? `${widthPct}%` : '100%'
  const wrapStyle: React.CSSProperties = { flex: `0 0 ${pct}`, minWidth: 0 }

  const labelEl = labelStr ? (
    <label style={s.label}>
      {labelStr}
      {isRequired && <span style={s.required}>*</span>}
    </label>
  ) : null

  switch (blockType) {
    case 'text':
    case 'email':
    case 'number':
    case 'phone':
      return (
        <div style={wrapStyle}>
          {labelEl}
          <input
            disabled
            style={s.input}
            type={blockType === 'email' ? 'email' : blockType === 'number' ? 'number' : 'text'}
          />
        </div>
      )

    case 'textarea':
      return (
        <div style={wrapStyle}>
          {labelEl}
          <textarea disabled style={s.textarea} />
        </div>
      )

    case 'select':
    case 'country':
    case 'state':
      return (
        <div style={wrapStyle}>
          {labelEl}
          <select disabled style={{ ...s.input, appearance: 'none' }}>
            <option value="">{labelStr ?? 'Select…'}</option>
            {Array.isArray(options) &&
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
      )

    case 'checkbox':
      return (
        <div style={{ ...s.checkboxRow, ...wrapStyle }}>
          <span style={s.checkbox} />
          <span style={s.checkboxLabel}>
            {isRequired && <span style={s.required}>*</span>}
            {labelStr}
          </span>
        </div>
      )

    case 'privacyPolicy': {
      const linkLabelStr = typeof linkLabel === 'string' ? linkLabel : 'privacy policy'
      const policyLabel = labelStr || 'I agree to the'
      return (
        <div style={{ ...s.checkboxRow, ...wrapStyle }}>
          <span style={s.checkbox} />
          <span style={s.checkboxLabel}>
            {isRequired && <span style={s.required}>*</span>}
            {policyLabel} <span style={{ textDecoration: 'underline' }}>{linkLabelStr}</span>
          </span>
        </div>
      )
    }

    case 'message':
      return (
        <div style={wrapStyle}>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--theme-elevation-400)',
              fontStyle: 'italic',
            }}
          >
            [Message block]
          </p>
        </div>
      )

    default:
      return null
  }
}

/**
 * Live form preview rendered in the admin sidebar.
 * Uses only Payload admin CSS variables so it works without the frontend stylesheet.
 */
export function FormPreview() {
  const [formState] = useAllFormFields()
  const { i18n } = useTranslation()
  const da = i18n.language === 'da'

  const rows = formState?.['fields']?.rows

  const header = (
    <div style={{ marginBottom: '0.75rem' }}>
      <p className="label" style={{ marginBottom: '0.25rem' }}>
        {da ? 'Formular layoutvisning' : 'Form Layout Preview'}
      </p>
      <p style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-400)', margin: 0 }}>
        {da
          ? 'Kun layout — stylingen svarer ikke nødvendigvis til din live formular.'
          : 'Layout only — styling may differ from your live form.'}
      </p>
    </div>
  )

  if (!rows || rows.length === 0) {
    return (
      <div className="field-type ui">
        {header}
        <p style={{ color: 'var(--theme-elevation-400)', fontSize: '0.75rem' }}>
          {da
            ? 'Tilføj felter for at se en layoutvisning af din formular.'
            : 'Add fields to see a layout preview of your form.'}
        </p>
      </div>
    )
  }

  const fieldBlocks: FieldPreviewProps[] = rows.map((row, index) => {
    const blockType = row.blockType ?? ''
    const prefix = `fields.${index}.`
    const props: FieldPreviewProps = { blockType }
    for (const [path, state] of Object.entries(formState)) {
      if (path.startsWith(prefix)) {
        const key = path.slice(prefix.length)
        if (!key.includes('.')) {
          props[key] = state.value
        }
      }
    }
    return props
  })

  const submitLabel =
    typeof formState?.['submitButtonLabel']?.value === 'string' &&
    formState['submitButtonLabel'].value !== ''
      ? formState['submitButtonLabel'].value
      : 'Submit'

  return (
    <div className="field-type ui">
      {header}
      <div
        style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          background: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-100)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {fieldBlocks.map((fieldProps, index) => (
          <FieldPreview key={index} {...fieldProps} />
        ))}
        <button
          disabled
          style={{
            alignSelf: 'flex-start',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.375rem',
            background: 'var(--theme-elevation-800)',
            color: 'var(--theme-elevation-50)',
            border: 'none',
            cursor: 'default',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
          type="button"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
