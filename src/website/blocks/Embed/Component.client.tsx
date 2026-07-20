'use client'

import React, { useRef, useState } from 'react'

const RESIZE_SCRIPT = `
  function postHeight() {
    var height = document.documentElement.scrollHeight
    parent.postMessage({ kollabEmbedHeight: height }, '*')
  }
  new ResizeObserver(postHeight).observe(document.documentElement)
  window.addEventListener('load', postHeight)
`

type EmbedFrameProps = {
  html: string
}

export const EmbedFrame: React.FC<EmbedFrameProps> = ({ html }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(200)

  const srcDoc = `<!doctype html><html><head><style>body{margin:0}</style></head><body>${html}<script>${RESIZE_SCRIPT}</script></body></html>`

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return
      const nextHeight = event.data?.kollabEmbedHeight
      if (typeof nextHeight === 'number' && nextHeight > 0) {
        setHeight(nextHeight)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      style={{ height }}
      className="w-full border-0"
      title="Embedded content"
    />
  )
}
