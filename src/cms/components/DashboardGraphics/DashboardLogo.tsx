import Image from 'next/image'
import React, { Suspense } from 'react'
import { getBranding, toLogoProps } from '@/cms/utilities/branding'

async function DashboardLogoContent() {
  const branding = await getBranding()
  const props = toLogoProps(branding)

  const lightSrc = props.lightSrc || '/assets/logo-on-light.svg'
  const darkSrc = props.darkSrc || '/assets/logo-on-dark.svg'
  const alt = props.alt || 'Logo'

  return (
    <div>
      <Image src={lightSrc} alt={alt} width={193} height={34} className="logo-light" />
      <Image src={darkSrc} alt={`${alt}-darkmode`} width={193} height={34} className="logo-dark" />
    </div>
  )
}

export default function DashboardLogo() {
  return (
    <Suspense
      fallback={<Image src="/assets/logo-on-light.svg" alt="Logo" width={193} height={34} />}
    >
      <DashboardLogoContent />
    </Suspense>
  )
}
