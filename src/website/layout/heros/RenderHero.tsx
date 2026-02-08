import React from 'react'

import type { Page } from '@/payload-types'
import { HighImpactHero } from './HighImpact'
import { LowImpactHero } from './LowImpact'
import { MediumImpactHero } from './MediumImpact'
import { SearchHero } from './SearchHero'
import type { TypedLocale } from 'payload'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  search: SearchHero,
}

export const RenderHero: React.FC<
  Page['hero'] & {
    locale?: TypedLocale
    pageSlug?: string
    searchParams?: {
      [key: string]: string | string[] | undefined
    }
  }
> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
