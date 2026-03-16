import { cn } from '@/cms/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { getTranslations } from 'next-intl/server'

import type { Page, Post } from '@/payload-types'
import { getPagePath } from '@/utils/paths'

type BreadcrumbItem = {
  label: string
  url?: string
}

type NormalizedBreadcrumbItem = {
  label: string
  url?: string
}

type BreadcrumbsProps = {
  className?: string
  items?: BreadcrumbItem[]
  page?: Page | null
  post?: Post | null
  includeHome?: boolean
  postsParentPath?: string
  postsParentLabel?: string
}

export const DEFAULT_POSTS_PARENT_PATH = '/posts'
export const DEFAULT_POSTS_PARENT_LABEL = 'Posts'


export const getPostsParentCrumb = (path: string, label: string): BreadcrumbItem => {
  return { label, url: path }
}

const normalizeItems = (items: BreadcrumbItem[]): NormalizedBreadcrumbItem[] => {
  const compact = items.reduce<NormalizedBreadcrumbItem[]>((acc, item) => {
    const label = item.label.trim()
    if (!label) return acc
    const url = item.url || undefined
    acc.push(url ? { label, url } : { label })
    return acc
  }, [])

  if (compact.length === 0) return []
  const lastIndex = compact.length - 1
  const last = compact[lastIndex]
  if (last) {
    compact[lastIndex] = { label: last.label }
  }
  return compact
}

const buildPageItems = (page: Page) => {
  const breadcrumbs = page?.breadcrumbs ?? []
  const fromField = breadcrumbs.reduce<BreadcrumbItem[]>((acc, crumb) => {
    const label =
      crumb?.label ||
      (typeof crumb?.doc === 'object' && crumb?.doc ? (crumb.doc as Page).title : undefined) ||
      (typeof crumb?.doc === 'object' && crumb?.doc ? (crumb.doc as Page).slug : undefined)
    if (!label) return acc
    const url =
      (crumb?.url ?? undefined) ||
      (typeof crumb?.doc === 'object' && crumb?.doc && (crumb.doc as Page).slug
        ? `/${(crumb.doc as Page).slug}`
        : undefined)
    acc.push(url ? { label, url } : { label })
    return acc
  }, [])

  if (fromField.length > 0) return fromField

  if (page?.slug || page?.title) {
    return [
      {
        label: page.title || page.slug,
        url: page.slug ? `/${page.slug}` : undefined,
      },
    ]
  }

  return []
}

const buildPostItems = (
  post: Post,
  options: {
    postsParentPath: string
    postsParentLabel: string
    includeHome: boolean
    homeLabel: string
  },
) => {
  const items: BreadcrumbItem[] = []

  if (options.includeHome) {
    items.push({ label: options.homeLabel, url: '/' })
  }

  items.push(getPostsParentCrumb(options.postsParentPath, options.postsParentLabel))

  if (post?.title || post?.slug) {
    items.push({ label: post.title || post.slug })
  }

  return items
}

export async function Breadcrumbs(props: BreadcrumbsProps) {
  const {
    className,
    items: itemsFromProps,
    page,
    post,
    includeHome,
    postsParentPath = DEFAULT_POSTS_PARENT_PATH,
    postsParentLabel = DEFAULT_POSTS_PARENT_LABEL,
  } = props

  let items: BreadcrumbItem[] = []

  const t = await getTranslations()
  const homeLabel = t('home')

  if (itemsFromProps && itemsFromProps.length > 0) {
    items = itemsFromProps
  } else if (page) {
    items = buildPageItems(page)
  } else if (post) {
    items = buildPostItems(post, {
      postsParentPath,
      postsParentLabel,
      includeHome: includeHome ?? true,
      homeLabel,
    })
  }

  const normalized = normalizeItems(items)
  if (normalized.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-primary', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {normalized.map((item, index) => {
          const isLast = index === normalized.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
              {item.url && !isLast ? (
                <Link className="hover:underline " href={item.url}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-primary/70">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="text-primary/40">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
