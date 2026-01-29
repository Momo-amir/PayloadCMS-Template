/**
 * Server-side analytics client
 * Replaces the old client-side GTM/GA4 approach
 * Keeps the SAME API so your components don't need changes
 */

import { getConsentFromCookie } from './consent-cookie'

interface AnalyticsEvent {
  event_name: string
  event_data?: Record<string, unknown>
  page_path?: string
}

class AnalyticsClient {
  private queue: AnalyticsEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private readonly BATCH_SIZE = 10 // Send after 10 events
  private readonly FLUSH_INTERVAL = 25000 // Or send every 25 seconds
  private consentGiven: boolean = false

  constructor() {
    if (typeof window === 'undefined') return

    // Check consent from first-party cookie (synchronous)
    this.syncConsentFromCookie()

    // Auto-flush every 25 seconds (catches low-activity pages)
    this.flushInterval = setInterval(() => this.flush(), this.FLUSH_INTERVAL)

    // Flush immediately when user leaves page
    window.addEventListener('beforeunload', () => this.flush())
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush()
      }
    })
  }

  private syncConsentFromCookie() {
    const consentState = getConsentFromCookie()
    this.consentGiven = consentState?.analytics === true
  }

  track(eventName: string, eventData?: Record<string, unknown>) {
    if (typeof window === 'undefined') return

    // CRITICAL: Check in-memory consent state (not storage, not DB)
    // If consent not given, track() becomes a no-op
    if (!this.consentGiven) {
      // Optional: log to console in dev for debugging
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Analytics] Event blocked - no consent:', eventName)
      }
      return
    }

    const event: AnalyticsEvent = {
      event_name: eventName,
      event_data: eventData,
      page_path: window.location.pathname,
    }

    this.queue.push(event)

    // Auto-flush if batch size reached (instant for high-activity pages)
    if (this.queue.length >= this.BATCH_SIZE) {
      this.flush()
    }
  }

  updateConsent(granted: boolean) {
    this.consentGiven = granted
    if (!granted) {
      // Clear queue if consent revoked
      this.queue = []
    }
  }

  private async flush() {
    if (this.queue.length === 0) return

    const eventsToSend = [...this.queue]
    this.queue = []

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend }),
        keepalive: true, // Important for beforeunload
      })
    } catch (error) {
      console.error('Analytics flush error:', error)
      // Re-queue events on failure
      this.queue.unshift(...eventsToSend)
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flush()
  }
}

// Singleton instance
const analyticsClient = new AnalyticsClient()

// Export main track function
export function track(event: string, data?: Record<string, unknown>) {
  analyticsClient.track(event, data)
}

// Update consent status (call from PrivacyProvider when consent changes)
export function updateAnalyticsConsent(granted: boolean) {
  analyticsClient.updateConsent(granted)
}

// All your existing helper functions - SAME API
export const trackButtonClick = (
  buttonName: string,
  section?: string,
  url?: string,
  isOutbound?: boolean,
): void => {
  track('button_click', {
    button_name: buttonName,
    section,
    destination_url: url,
    is_outbound: isOutbound,
  })
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

// Standard analytics additions
export const trackScrollDepth = (depth: 50 | 100): void => {
  track('scroll_depth', { depth_percentage: depth })
}

export const trackError = (errorType: string, errorMessage?: string, path?: string): void => {
  track('error', { error_type: errorType, error_message: errorMessage, page_path: path })
}

// Helper to bucket viewport size for privacy compliance
function bucketViewport(width: number, height: number): string {
  let category = 'unknown'
  if (width < 640) category = 'mobile'
  else if (width < 1024) category = 'tablet'
  else if (width < 1920) category = 'desktop'
  else category = 'large'

  // Include aspect ratio hint
  const aspectRatio = height > 0 ? (width / height).toFixed(2) : '0'
  return `${category}_${aspectRatio}`
}

export const trackPageView = (title?: string, referrer?: string): void => {
  track('page_view', {
    page_title: title || document?.title,
    referrer: referrer || document?.referrer,
    viewport_category:
      typeof window !== 'undefined'
        ? bucketViewport(window.innerWidth, window.innerHeight)
        : undefined,
  })
}

export const trackEngagement = (timeOnPage: number, scrollDepth: number): void => {
  track('user_engagement', {
    engagement_time_msec: timeOnPage,
    scroll_depth_percentage: scrollDepth,
  })
}

// Backward compatibility
export const analyticsEvent = track

// No longer needed (consent handled server-side)
export const updateConsent = () => {
  console.warn('updateConsent is deprecated - consent managed server-side')
}

/**
 * Scroll depth tracking hook for long-form content
 * Add <ScrollDepthTracker /> to layouts where you want to track scroll depth
 * Tracks only 50% and 100% to reduce event volume
 */
export const useScrollDepthTracking = () => {
  if (typeof window === 'undefined') return

  const scrollDepths = { 50: false, 100: false }

  const createScrollSentinel = (depth: 50 | 100) => {
    const sentinel = document.createElement('div')
    sentinel.id = `scroll-depth-${depth}`
    sentinel.style.position = 'absolute'
    sentinel.style.top = `${depth}%`
    sentinel.style.width = '100%'
    sentinel.style.height = '1px'
    sentinel.style.pointerEvents = 'none'
    sentinel.style.visibility = 'hidden'
    document.body.appendChild(sentinel)
    return sentinel
  }

  const setupTracking = () => {
    const sentinels = {
      50: createScrollSentinel(50),
      100: createScrollSentinel(100),
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const depth = parseInt(entry.target.id.split('-')[2] || '0') as 50 | 100
            if (!scrollDepths[depth]) {
              scrollDepths[depth] = true
              trackScrollDepth(depth)
            }
          }
        })
      },
      { threshold: 0 },
    )

    Object.values(sentinels).forEach((sentinel) => observer.observe(sentinel))

    return () => {
      observer.disconnect()
      Object.values(sentinels).forEach((sentinel) => sentinel.remove())
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTracking)
  } else {
    return setupTracking()
  }
}
