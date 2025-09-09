'use client'
import Image from 'next/image'
import React from 'react'

export default function Graphics() {
  const [src, setSrc] = React.useState<string>('/assets/favicon-lightmode.svg')

  React.useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch('/api/globals/branding?depth=1', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()

        if (!cancelled && url) setSrc(url)
        const url =
          data?.faviconLight && typeof data.faviconLight === 'object' && data.faviconLight.filename
            ? `/media/${data.faviconLight.filename}`
            : '/assets/favicon-lightmode.svg'

        if (!cancelled) setSrc(url)
      } catch {
        // Keep fallback on error
        if (!cancelled) setSrc('/assets/favicon-lightmode.svg')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return <Image src={src} alt="Logo" width={200} height={200} />
}
