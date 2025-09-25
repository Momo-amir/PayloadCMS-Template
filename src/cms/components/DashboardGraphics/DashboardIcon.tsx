import Image from 'next/image'
import React, { Suspense } from 'react'
import { getBranding, toFaviconProps } from '@/cms/utilities/branding'

async function DashboardIconContent() {
  const branding = await getBranding()
  const props = toFaviconProps(branding)

  const lightSrc = props.lightHref
  const darkSrc = props.darkHref
  const alt = 'Favicon'

  return (
    <div>
      <Image src={lightSrc} alt={alt} width={200} height={200} className="favicon-light" />
      <Image
        src={darkSrc}
        alt={`${alt}-darkmode`}
        width={200}
        height={200}
        className="favicon-dark"
      />
    </div>
  )
}

export default function DashboardIcon() {
  return (
    <Suspense
      fallback={
        <Image src="/assets/favicon-lightmode.svg" alt="Favicon" width={200} height={200} />
      }
    >
      <DashboardIconContent />
    </Suspense>
  )
}
