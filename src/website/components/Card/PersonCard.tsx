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

export type CardPersonData = Pick<Person, 'firstName' | 'lastName' | 'title' | 'email' | 'image'>

export const PersonCard: React.FC<{
  className?: string
  doc?: CardPersonData
}> = (props) => {
  const { className, doc } = props

  const { firstName, lastName, title, email, image } = doc || {}

  const fullName = `${firstName} ${lastName}`

  return (
    <article className={cn('group h-full', className)}>
      <CardComponent
        className={cn('h-full flex flex-col transition hover:shadow-md bg-card border-border')}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
          {!image && (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground bg-muted">
              No image
            </div>
          )}
          {image && typeof image !== 'string' && (
            <Media resource={image} fill imgClassName="object-cover" />
          )}
        </div>

        <CardHeader className="text-center">
          <CardTitle className="text-xl">{fullName}</CardTitle>
          {title && <p className="text-sm text-muted-foreground font-medium">{title}</p>}
        </CardHeader>

        {email && (
          <CardContent className="pt-0 text-center">
            <a href={`mailto:${email}`} className="text-sm text-primary hover:underline">
              {email}
            </a>
          </CardContent>
        )}
      </CardComponent>
    </article>
  )
}
