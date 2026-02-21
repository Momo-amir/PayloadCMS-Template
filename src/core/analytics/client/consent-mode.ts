/**
 * Analytics utility - pushes events to GTM dataLayer
 * Configure tags in GTM UI: https://tagmanager.google.com/
 */

// currently unused - but kept for potential future use

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, action: string | Date, params?: unknown) => void
  }
}

export function track(event: string, value?: unknown): void {
  if (typeof window === 'undefined') return

  try {
    const params = typeof value === 'object' && value !== null ? value : undefined

    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params)
      return
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event,
      ...(params ? params : {}),
    })
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

// Alias for compatibility
export const analyticsEvent = track

// Convenience helpers for commonly used events
// Provides autocomplete and consistent parameter names
// You can also use track() directly: track('event_name', { any: 'params' })

export const trackButtonClick = (buttonName: string, section?: string, url?: string): void => {
  track('button_click', { button_name: buttonName, section, destination_url: url })
}

export const trackCardClick = (
  cardTitle: string,
  cardType?: string,
  destination?: string,
): void => {
  track('card_click', { card_title: cardTitle, card_type: cardType, destination_url: destination })
}

export const trackPostCardClick = (
  postTitle: string,
  postSlug: string,
  categories?: string[],
  position?: number,
  listContext?: string,
): void => {
  track('post_card_click', {
    post_title: postTitle,
    post_slug: postSlug,
    categories: categories?.join(', '),
    position,
    list_context: listContext,
  })
}

export const trackPostView = (postTitle: string, postSlug: string, categories?: string[]): void => {
  track('post_view', {
    post_title: postTitle,
    post_slug: postSlug,
    categories: categories?.join(', '),
  })
}

export const trackFormSubmit = (formName: string, formType?: string, success?: boolean): void => {
  track('form_submit', { form_name: formName, form_type: formType, success: success ?? true })
}

export const trackSearch = (searchTerm: string, resultsCount?: number): void => {
  track('search', { search_term: searchTerm, results_count: resultsCount })
}

export const trackVideoInteraction = (
  action: 'play' | 'pause' | 'complete',
  videoTitle: string,
  progress?: number,
): void => {
  track('video_interaction', { action, video_title: videoTitle, progress })
}

// Google Consent Mode v2
export const updateConsent = (
  command: 'default' | 'update',
  params: {
    analytics_storage?: 'granted' | 'denied'
    ad_storage?: 'granted' | 'denied'
    ad_user_data?: 'granted' | 'denied'
    ad_personalization?: 'granted' | 'denied'
  },
): void => {
  if (typeof window === 'undefined') return

  try {
    if (typeof window.gtag !== 'function') {
      window.dataLayer = window.dataLayer || []
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args)
      }
    }

    window.gtag('consent', command, params)
  } catch (error) {
    console.error('Consent update error:', error)
  }
}
