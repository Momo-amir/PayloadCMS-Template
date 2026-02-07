'use client'
import { cn } from '@/cms/utilities/ui'
import React from 'react'

import type { Person } from '@/payload-types'

import { Media } from '@/website/components/Media'
import {
  Card as CardComponent,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/website/components/elements/card'
import { trackButtonClick } from '@/cms/utilities/analytics-server'
import { usePrivacy } from '@/providers/Privacy'
import { useTranslations } from 'next-intl'

export type CardPersonData = Pick<Person, 'firstName' | 'lastName' | 'title' | 'email' | 'image'>

export const PersonCard: React.FC<{
  className?: string
  doc?: CardPersonData
}> = (props) => {
  const { className, doc } = props
  const { cookieConsent } = usePrivacy()

  const { firstName, lastName, title, email, image } = doc || {}

  const fullName = `${firstName} ${lastName}`

  const handleEmailClick = () => {
    if (cookieConsent && email) {
      trackButtonClick(`${fullName} Email`, 'Person Card', `mailto:${email}`)
    }
  }

  const t = useTranslations()

  return (
    <article className={cn('group h-full', className)}>
      <CardComponent
        className={cn('h-full flex flex-col transition bg-surface border-none shadow-md ')}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
          {!image && (
            <div className="flex h-full w-full items-center justify-center text-sm bg-accent text-white">
              {t('no-image')}
            </div>
          )}
          {image && typeof image !== 'string' && (
            <Media resource={image} fill imgClassName="object-cover" />
          )}
        </div>

        <CardHeader className="">
          <CardTitle className="text-xl wrap-break-word">{fullName}</CardTitle>
          {title && <p className="text-sm wrap-break-word">{title}</p>}
        </CardHeader>

        {email && (
          <CardContent className="pt-0 border-none ">
            <a
              href={`mailto:${email}`}
              className="text-sm text-primary hover:underline wrap-break-word"
              onClick={handleEmailClick}
            >
              {email}
            </a>
          </CardContent>
        )}
      </CardComponent>
    </article>
  )
}
