import { NextResponse } from 'next/server'

// List of GDPR countries (EU member states + EEA countries)
const GDPR_COUNTRIES = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
  'IS', // Iceland (EEA)
  'LI', // Liechtenstein (EEA)
  'NO', // Norway (EEA)
  'GB', // United Kingdom (maintains GDPR-equivalent)
  'CH', // Switzerland (GDPR-equivalent)
]

export async function GET(request: Request) {
  try {
    // Try to get country from various geo headers
    const country =
      request.headers.get('x-vercel-ip-country') || // Vercel
      request.headers.get('cf-ipcountry') || // Cloudflare
      request.headers.get('x-country-code') || // Other hosting providers
      ''

    const countryUpper = country.toUpperCase()
    const isGDPR = GDPR_COUNTRIES.includes(countryUpper)

    // In development, if no country is detected, assume GDPR region for testing
    // This ensures the banner shows up for testing purposes
    const isDevelopment = process.env.NODE_ENV === 'development'
    const shouldShowBanner = isDevelopment ? (country ? isGDPR : true) : isGDPR

    return NextResponse.json({
      country: countryUpper || 'UNKNOWN',
      isGDPR: shouldShowBanner,
      isDevelopment, // For debugging
    })
  } catch (error) {
    console.error('Error detecting location:', error)

    // Default to GDPR-compliant (privacy-first approach)
    return NextResponse.json({
      country: '',
      isGDPR: true,
    })
  }
}
