'use client'
import Image from 'next/image'
import React from 'react'

type MediaRef = number | { filename?: string } | null | undefined

const mediaToURL = (m: MediaRef): string | undefined => {
  if (!m) return undefined
  if (typeof m === 'number') return undefined
  if (m.filename) return `/media/${m.filename}`
  return undefined
}

export default function Graphics() {
  const [src, setSrc] = React.useState<string>('/assets/favicon-lightmode.svg')

  React.useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch('/api/globals/branding?depth=1', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const url = mediaToURL(data?.faviconLight)
        if (!cancelled && url) setSrc(url)
      } catch {
        // ignore and keep fallback
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return <Image src={src} alt="Logo" width={200} height={200} />
}
