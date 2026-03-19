'use client'
import { Input } from '@/website/components/elements/input'
import { Label } from '@/website/components/elements/label'
import React, { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/cms/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'
import { trackSearch } from '@/cms/utilities/analytics-server'
import { usePrivacy } from '@/providers/Privacy'
import { useTranslations } from 'next-intl'

export const SearchInput: React.FC<{
  resultsCount?: number
  searchPath?: string
  liveSearch?: boolean
}> = ({ resultsCount, searchPath = '/search', liveSearch = true }) => {
  const searchParams = useSearchParams()
  const [value, setValue] = useState(() => searchParams.get('q') ?? '')
  const hasInteracted = useRef(false)
  const router = useRouter()
  const { cookieConsent } = usePrivacy()

  const debouncedValue = useDebounce(value)
  const t = useTranslations()

  useEffect(() => {
    if (!liveSearch) {
      return
    }
    if (!hasInteracted.current) {
      return
    }

    router.push(`${searchPath}${debouncedValue ? `?q=${debouncedValue}` : ''}`, {
      scroll: false,
    })

    if (cookieConsent && debouncedValue) {
      trackSearch(debouncedValue, resultsCount)
    }
  }, [debouncedValue, router, cookieConsent, resultsCount, searchPath, liveSearch])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!liveSearch) {
      router.push(`${searchPath}${value ? `?q=${value}` : ''}`, {
        scroll: false,
      })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="search" className="sr-only">
          {t('search')}
        </Label>
        <Input
          className="dark:border-surface dark:focus-visible:border-primary"
          id="search"
          value={value}
          onChange={(event) => {
            hasInteracted.current = true
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
