import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { cn } from '@/cms/utilities/ui'
import React from 'react'

interface PromoStripProps {
  usps: [
    {
      text: string
      icon?: string
    },
  ]
  backgroundColor: string
  textColor: string
}

/*  
////////////////////////////
  HEY NIKLAS! :) 
  Din komponent ser lidt anderledes ud end du måske husker.

  TLDR: Der er ændringer fordi Localization og analytics, hent mig og jeg kan forklare.


  Siden du har arbejdet på det sidst er der tilføjet Analytics og localization. Så jeg blev nød til at ændre lidt.

  Se TrackImpression for at forstå hvordan det virker, samt localization true i config.ts.

  I forhold til de andre ændringer. 
  
  Vi indskrænker mulighederne for at style komponenterne direkte fra dashbordet.
  
  Variantioner som dem der er i CustomCard.tsx og CardBlock er måden vi gerne vil gøre det.
  Du burde kunne kopiere det til PromoStrip.

  I forhold til Ikonet - Projektet har indbygget Tabler Icons support - så brug det istedet for Font Awesome. 

  Du ville kunne bruge: <IconSquareFilled/> eller lave en liste af dem
  
  Hvis du vil have logo support er det selvfølgelig muligt med et Upload field med relation til media. 

  Tjek CardBlock for hvordan det er gjort der.

  - Momo
//////////////////////////////////////////

*/

export const PromoStripComponent: React.FC<PromoStripProps> = ({
  usps,
  // backgroundColor,
  // textColor,
}) => {
  const hasUSPs = usps && Array.isArray(usps) && usps.length > 0

  if (!hasUSPs) {
    return null
  }

  /*

   const backgroundStyle = backgroundColor ? { backgroundColor } : {}
   const textStyle = textColor ? { color: textColor } : {}

    style={{
    ...backgroundStyle,
    ...textStyle,
    color: textColor || undefined,
    }}
   */

  return (
    <div className="my-16">
      <TrackImpression
        componentName={`Promo Strip (${usps.length} USPs)`}
        componentType="promo-strip"
        as="section"
      >
        <section className={cn('promo-strip')}>
          <ul className="promo-strip-usps">
            {usps?.map((usp, i) => (
              <li key={i} className="promo-strip-usp">
                {usp.icon && (
                  <i className={usp.icon} aria-hidden="true" style={{ marginRight: 8 }} />
                )}
                <span>{usp.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </TrackImpression>
    </div>
  )
}
