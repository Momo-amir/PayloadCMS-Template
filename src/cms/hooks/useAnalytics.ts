/**
 * Custom React hooks for analytics tracking
 * These hooks make it easy to add analytics to your components
 */

import { useEffect, useRef, useCallback } from 'react'
import { track, trackButtonClick } from '@/cms/utilities/analytics-server'
import { usePrivacy } from '@/providers/Privacy'

/**
 * Hook to track button/CTA clicks
 * @param buttonName - Name of the button
 * @param section - Section where the button is located
 *
 * @example
 * const trackClick = useTrackClick('Sign Up Button', 'Hero Section')
 * <button onClick={trackClick}>Sign Up</button>
 */
export const useTrackClick = (buttonName: string, section?: string) => {
  const { cookieConsent } = usePrivacy()

  return useCallback(
    (url?: string) => {
      if (!cookieConsent) return
      trackButtonClick(buttonName, section, url)
    },
    [buttonName, section, cookieConsent],
  )
}

/**
 * Hook to track component impressions (when component becomes visible)
 * Uses Intersection Observer API
 *
 * **SESSION DEDUPLICATION:** Each component is tracked only ONCE per session,
 * preventing duplicate impressions on page navigation or re-renders.
 *
 * @param componentName - Name of the component
 * @param componentType - Type of component (e.g., 'hero', 'cta', 'testimonial')
 * @param threshold - Visibility threshold (0-1, default 0.5 = 50% visible)
 * @param minVisibleTime - Minimum time in ms the component must be visible before tracking (default 1000ms = 1s)
 *
 * @example
 * // Track when 50% visible for at least 1 second
 * const ref = useTrackImpression('Hero Banner', 'hero')
 *
 * // Track when 30% visible for at least 500ms
 * const ref = useTrackImpression('CTA Section', 'cta', 0.3, 500)
 */
export const useTrackImpression = (
  componentName: string,
  componentType?: string,
  threshold = 0.5,
  minVisibleTime = 1000,
) => {
  const { cookieConsent } = usePrivacy()
  const ref = useRef<HTMLElement>(null)
  const hasTracked = useRef(false)
  const visibilityTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!cookieConsent || !ref.current || hasTracked.current) return

    // Session deduplication - check if this component was already tracked
    const sessionKey = `analytics_impression_${componentName}_${componentType || 'default'}`
    const alreadyTrackedInSession = sessionStorage.getItem(sessionKey)

    if (alreadyTrackedInSession === 'true') {
      hasTracked.current = true
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            // Start timer when component becomes visible
            visibilityTimer.current = setTimeout(() => {
              if (!hasTracked.current) {
                track('component_impression', {
                  component_name: componentName,
                  component_type: componentType,
                })
                hasTracked.current = true
                // Mark as tracked in session storage
                sessionStorage.setItem(sessionKey, 'true')
              }
            }, minVisibleTime)
          } else {
            // Clear timer if component becomes hidden before minVisibleTime
            if (visibilityTimer.current) {
              clearTimeout(visibilityTimer.current)
              visibilityTimer.current = null
            }
          }
        })
      },
      { threshold },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
      if (visibilityTimer.current) {
        clearTimeout(visibilityTimer.current)
      }
    }
  }, [componentName, componentType, threshold, minVisibleTime, cookieConsent])

  return ref
}

/**
 * Hook to track scroll depth on the current page
 * Tracks at 25%, 50%, 75%, and 100% scroll depths
 *
 * @example
 * const Component = () => {
 *   useTrackScrollDepth()
 *   return <div>...</div>
 * }
 */
export const useTrackScrollDepth = () => {
  const { cookieConsent } = usePrivacy()
  const trackedDepths = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!cookieConsent) return

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      const scrollPercentage = Math.round(((scrollTop + windowHeight) / documentHeight) * 100)

      // Track at 25%, 50%, 75%, and 100%
      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone)
          track('scroll_depth', {
            depth_percentage: milestone,
            page: window.location.pathname,
          })
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [cookieConsent])
}

/**
 * Hook to track link clicks
 * @param linkText - Text of the link
 * @param linkUrl - URL of the link
 * @param isExternal - Whether the link is external
 *
 * @example
 * const trackLink = useTrackLink('Read More', '/blog/post-1')
 * <a href="/blog/post-1" onClick={trackLink}>Read More</a>
 */
export const useTrackLink = (linkText: string, linkUrl: string, isExternal = false) => {
  const { cookieConsent } = usePrivacy()

  return useCallback(() => {
    if (!cookieConsent) return
    track('link_click', {
      link_text: linkText,
      link_url: linkUrl,
      link_type: isExternal ? 'external' : 'internal',
    })
  }, [linkText, linkUrl, isExternal, cookieConsent])
}

/**
 * Hook to track custom analytics events
 * @param eventName - Name of the event
 *
 * @example
 * const trackEvent = useTrackEvent('custom_interaction')
 * trackEvent({ action: 'hover', element: 'card' })
 */
export const useTrackEvent = (eventName: string) => {
  const { cookieConsent } = usePrivacy()

  return useCallback(
    (params?: Record<string, unknown>) => {
      if (!cookieConsent) return
      track(eventName, params)
    },
    [eventName, cookieConsent],
  )
}

/**
 * Hook to track time spent on a component/page
 * Sends event when component unmounts
 *
 * @param componentName - Name of the component
 *
 * @example
 * const Component = () => {
 *   useTrackTimeSpent('Product Detail Page')
 *   return <div>...</div>
 * }
 */
export const useTrackTimeSpent = (componentName: string) => {
  const { cookieConsent } = usePrivacy()
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    const start = startTime.current

    return () => {
      if (!cookieConsent) return

      const timeSpent = Math.round((Date.now() - start) / 1000) // in seconds

      track('time_spent', {
        component_name: componentName,
        duration_seconds: timeSpent,
      })
    }
  }, [componentName, cookieConsent])
}
