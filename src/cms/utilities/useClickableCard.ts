'use client'
import type { RefObject } from 'react'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

type UseClickableCardType<T extends HTMLElement> = {
  card: {
    ref: RefObject<T | null>
  }
  link: {
    ref: RefObject<HTMLAnchorElement | null>
    props: {
      target?: string
      rel?: string
    }
  }
}

interface Props {
  external?: boolean
  newTab?: boolean
  scroll?: boolean
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter()
  const card = useRef<T>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const timeDown = useRef<number>(0)
  const hasActiveParent = useRef<boolean>(false)
  const pressedButton = useRef<number>(0)

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!e.target) return
      const target = e.target as Element
      const parent = target.closest('a')

      pressedButton.current = e.button
      hasActiveParent.current = !!parent
      if (!parent) timeDown.current = Date.now()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, card, link, timeDown],
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      const anchor = link.current
      const hrefFromAnchor = anchor?.getAttribute('href') || anchor?.href || ''
      if (!hrefFromAnchor) return
      if (Date.now() - timeDown.current > 250) return
      if (hasActiveParent.current || pressedButton.current !== 0 || e.ctrlKey) return

      // Decide external intelligently if not provided
      let resolvedExternal = external
      let to = hrefFromAnchor
      try {
        // Treat non-http(s) protocols as external
        if (typeof resolvedExternal !== 'boolean') {
          if (
            /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(hrefFromAnchor) &&
            !/^https?:/i.test(hrefFromAnchor)
          ) {
            resolvedExternal = true
          } else {
            const u = new URL(hrefFromAnchor, window.location.href)
            resolvedExternal = u.origin !== window.location.origin
            // Build relative for internal navigation
            to = `${u.pathname}${u.search}${u.hash}`
          }
        }
      } catch {
        // Fallback: assume internal
        resolvedExternal = false
      }

      if (newTab) {
        window.open(hrefFromAnchor, '_blank')
      } else if (resolvedExternal) {
        window.open(hrefFromAnchor, '_self')
      } else {
        router.push(to, { scroll })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, card, link, timeDown],
  )

  useEffect(() => {
    const cardNode = card.current

    const abortController = new AbortController()

    if (cardNode) {
      // Fallback: if consumer did not bind link.ref, try to find first anchor inside card
      if (!link.current) {
        const found = cardNode.querySelector('a') as HTMLAnchorElement | null
        if (found) link.current = found
      }
      cardNode.addEventListener('mousedown', handleMouseDown, {
        signal: abortController.signal,
      })
      cardNode.addEventListener('mouseup', handleMouseUp, {
        signal: abortController.signal,
      })
    }

    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, link, router])

  const linkProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return {
    card: {
      ref: card,
    },
    link: {
      ref: link,
      props: linkProps,
    },
  }
}

export default useClickableCard
