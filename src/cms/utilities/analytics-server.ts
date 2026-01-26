/**
 * Server-side analytics client
 * Replaces the old client-side GTM/GA4 approach
 * Keeps the SAME API so your components don't need changes
 */

interface AnalyticsEvent {
  event_name: string
  event_data?: Record<string, unknown>
  page_path?: string
}

class AnalyticsClient {
  private queue: AnalyticsEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private readonly BATCH_SIZE = 10 // Send after 10 events
  private readonly FLUSH_INTERVAL = 5000 // Or send every 5 seconds
  private consentGiven: boolean = false

  constructor() {
    if (typeof window === 'undefined') return

    // Check consent status on init
    this.checkConsent()

    // Auto-flush every 5 seconds (catches low-activity pages)
    this.flushInterval = setInterval(() => this.flush(), this.FLUSH_INTERVAL)

    // Flush immediately when user leaves page
    window.addEventListener('beforeunload', () => this.flush())
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush()
      }
    })
  }

  private async checkConsent() {
    try {
      const response = await fetch('/api/consent')
      const data = await response.json()
      this.consentGiven = data.analytics === true
    } catch {
      this.consentGiven = false
    }
  }

  track(eventName: string, eventData?: Record<string, unknown>) {
    if (typeof window === 'undefined') return

    // Don't queue events if consent not given
    if (!this.consentGiven) return

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
export const trackScrollDepth = (depth: 25 | 50 | 75 | 100): void => {
  track('scroll_depth', { depth_percentage: depth })
}

export const trackError = (errorType: string, errorMessage?: string, path?: string): void => {
  track('error', { error_type: errorType, error_message: errorMessage, page_path: path })
}

export const trackPageView = (title?: string, referrer?: string): void => {
  track('page_view', {
    page_title: title || document?.title,
    referrer: referrer || document?.referrer,
    screen_resolution:
      typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : undefined,
    viewport_size:
      typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : undefined,
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
 */
export const useScrollDepthTracking = () => {
  if (typeof window === 'undefined') return

  const scrollDepths = { 25: false, 50: false, 75: false, 100: false }

  const createScrollSentinel = (depth: 25 | 50 | 75 | 100) => {
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
      25: createScrollSentinel(25),
      50: createScrollSentinel(50),
      75: createScrollSentinel(75),
      100: createScrollSentinel(100),
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const depth = parseInt(entry.target.id.split('-')[2] || '0') as 25 | 50 | 75 | 100
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
