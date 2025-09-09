'use client'
import React from 'react'
import { toast, Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

interface ResetThemeColorsButtonProps {
  custom?: {
    globalSlug?: string
  }
}

export const ResetThemeColorsButton: React.FC<ResetThemeColorsButtonProps> = ({ custom }) => {
  const router = useRouter()
  const globalSlug = custom?.globalSlug || 'branding'

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all theme colors to their default values? This action cannot be undone.',
    )

    if (!confirmed) return

    try {
      const response = await fetch(`/api/globals/${globalSlug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          themeColors: {
            enableCustomColors: false,
            light: null,
            dark: null,
          },
        }),
      })

      if (response.ok) {
        toast.success('Theme colors reset successfully')
        router.refresh()
      } else {
        throw new Error('Failed to reset theme colors')
      }
    } catch (error) {
      console.error('Error resetting theme colors:', error)
      toast.error('Failed to reset theme colors. Please try again.')
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Button buttonStyle="secondary" onClick={handleReset} size="small">
        Reset Theme Colors
      </Button>
      <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
        Click to reset all theme colors to their default values and disable custom color editing.
      </p>
    </div>
  )
}
