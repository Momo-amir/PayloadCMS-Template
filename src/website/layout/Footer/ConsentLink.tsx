'use client'

import { Button } from '@/website/components/elements/button'
import { usePrivacy } from '@/providers/Privacy'
import { useTranslations } from 'next-intl'
import React from 'react'

export const ConsentLink: React.FC = () => {
  const { openConsentBanner } = usePrivacy()
  const t = useTranslations()

  return (
    <Button type="button" size="clear" variant="link" onClick={openConsentBanner}>
      {t('cookie-consent:settings')}
    </Button>
  )
}
