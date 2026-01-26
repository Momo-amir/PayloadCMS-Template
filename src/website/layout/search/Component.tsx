'use client'
import { Input } from '@/website/components/elements/input'
import { Label } from '@/website/components/elements/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/cms/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { trackSearch } from '@/cms/utilities/analytics-server'
import { usePrivacy } from '@/providers/Privacy'
import { useTranslations } from 'next-intl'

export const Search: React.FC<{ resultsCount?: number }> = ({ resultsCount }) => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const { cookieConsent } = usePrivacy()

  const debouncedValue = useDebounce(value)
  const t = useTranslations()

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`)

    // Track search query when user stops typing
    if (cookieConsent && debouncedValue) {
      trackSearch(debouncedValue, resultsCount)
    }
  }, [debouncedValue, router, cookieConsent, resultsCount])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {t('search')}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={t('search')}
        />
        <button type="submit" className="sr-only">
          {t('submit')}
        </button>
      </form>
    </div>
  )
}
