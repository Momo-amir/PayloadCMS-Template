/**
 * Analytics utility functions for Google Analytics event tracking
 * These functions provide a type-safe way to track custom events throughout your application
 */

type ConsentStatus = 'granted' | 'denied'

type ConsentParams = {
  analytics_storage?: ConsentStatus
  ad_storage?: ConsentStatus
  ad_user_data?: ConsentStatus
  ad_personalization?: ConsentStatus
  wait_for_update?: number
}

declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'event' | 'config' | 'js',
      action: string | Date,
      params?: unknown,
    ) => void
    dataLayer?: Record<string, unknown>[]
  }
}

export type AnalyticsEventParams = {
  [key: string]: string | number | boolean | undefined
}

/**
 * Update Google Consent Mode
 * @param consentType - 'default' or 'update'
 * @param params - Consent parameters
 *
 * @example
 * updateConsent('update', {
 *   analytics_storage: 'granted',
 *   ad_storage: 'granted'
 * })
 */
export const updateConsent = (consentType: 'default' | 'update', params: ConsentParams): void => {
  if (typeof window === 'undefined') return

  try {
    if (window.gtag) {
      window.gtag('consent', consentType, params)
    }
  } catch (error) {
    console.error('Consent update error:', error)
  }
}

/**
 * Send a custom event to Google Analytics
 * @param eventName - The name of the event (e.g., 'button_click', 'form_submit')
 * @param params - Optional parameters to attach to the event
 *
 * @example
 * analyticsEvent('cta_click', {
 *   button_name: 'Sign Up',
 *   section: 'Hero',
 *   value: 1
 * })
 */
export const analyticsEvent = (eventName: string, params?: AnalyticsEventParams): void => {
  if (typeof window === 'undefined') return

  try {
    if (window.gtag) {
      window.gtag('event', eventName, params)
    }
  } catch (error) {
    console.error('Analytics event error:', error)
  }
}

/**
 * Track page views
 * @param path - The page path
 * @param title - The page title
 *
 * @example
 * trackPageView('/about', 'About Us')
 */
export const trackPageView = (path: string, title?: string): void => {
  analyticsEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  })
}

/**
 * Track button/CTA clicks
 * @param buttonName - Name of the button clicked
 * @param section - Section where the button is located
 * @param url - Optional destination URL
 *
 * @example
 * trackButtonClick('Get Started', 'Hero', '/signup')
 */
export const trackButtonClick = (buttonName: string, section?: string, url?: string): void => {
  analyticsEvent('button_click', {
    button_name: buttonName,
    section: section,
    destination_url: url,
  })
}

/**
 * Track link clicks
 * @param linkText - The text of the link
 * @param linkUrl - The URL of the link
 * @param isExternal - Whether the link is external
 *
 * @example
 * trackLinkClick('Read More', '/blog/post-1', false)
 */
export const trackLinkClick = (linkText: string, linkUrl: string, isExternal?: boolean): void => {
  analyticsEvent('link_click', {
    link_text: linkText,
    link_url: linkUrl,
    link_type: isExternal ? 'external' : 'internal',
  })
}

/**
 * Track form submissions
 * @param formName - Name of the form
 * @param formType - Type of form (e.g., 'contact', 'newsletter', 'signup')
 * @param success - Whether the submission was successful
 *
 * @example
 * trackFormSubmit('Contact Form', 'contact', true)
 */
export const trackFormSubmit = (formName: string, formType?: string, success?: boolean): void => {
  analyticsEvent('form_submit', {
    form_name: formName,
    form_type: formType,
    success: success !== undefined ? success : true,
  })
}

/**
 * Track video interactions
 * @param action - The action taken (play, pause, complete)
 * @param videoTitle - Title of the video
 * @param progress - Progress percentage (0-100)
 *
 * @example
 * trackVideoInteraction('play', 'Product Demo', 0)
 */
export const trackVideoInteraction = (
  action: 'play' | 'pause' | 'complete',
  videoTitle: string,
  progress?: number,
): void => {
  analyticsEvent('video_interaction', {
    action,
    video_title: videoTitle,
    progress: progress,
  })
}

/**
 * Track file downloads
 * @param fileName - Name of the downloaded file
 * @param fileType - Type of file (pdf, docx, etc.)
 * @param fileUrl - URL of the file
 *
 * @example
 * trackDownload('whitepaper.pdf', 'pdf', '/downloads/whitepaper.pdf')
 */
export const trackDownload = (fileName: string, fileType?: string, fileUrl?: string): void => {
  analyticsEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
    file_url: fileUrl,
  })
}

/**
 * Track search queries
 * @param searchTerm - The search term entered
 * @param resultsCount - Number of results returned
 *
 * @example
 * trackSearch('payload cms', 12)
 */
export const trackSearch = (searchTerm: string, resultsCount?: number): void => {
  analyticsEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  })
}

/**
 * Track scroll depth
 * @param percentage - Scroll depth percentage (25, 50, 75, 100)
 * @param page - The page being scrolled
 *
 * @example
 * trackScrollDepth(50, '/blog/post-1')
 */
export const trackScrollDepth = (percentage: number, page?: string): void => {
  analyticsEvent('scroll_depth', {
    percentage,
    page: page || window.location.pathname,
  })
}

/**
 * Track component visibility/impressions
 * @param componentName - Name of the component
 * @param componentType - Type of component (e.g., 'hero', 'cta', 'testimonial')
 *
 * @example
 * trackComponentImpression('Hero Banner', 'hero')
 */
export const trackComponentImpression = (componentName: string, componentType?: string): void => {
  analyticsEvent('component_impression', {
    component_name: componentName,
    component_type: componentType,
  })
}

/**
 * Track ecommerce/conversion events
 * @param action - The conversion action
 * @param value - Monetary value
 * @param currency - Currency code (default: USD)
 * @param additionalParams - Additional conversion parameters
 *
 * @example
 * trackConversion('purchase', 99.99, 'USD', { item_name: 'Premium Plan' })
 */
export const trackConversion = (
  action: string,
  value?: number,
  currency = 'USD',
  additionalParams?: AnalyticsEventParams,
): void => {
  analyticsEvent(action, {
    value,
    currency,
    ...additionalParams,
  })
}

/**
 * Track social media interactions
 * @param network - Social network (facebook, twitter, linkedin, etc.)
 * @param action - Action taken (share, like, follow)
 * @param target - What was shared/liked/followed
 *
 * @example
 * trackSocialInteraction('twitter', 'share', '/blog/post-1')
 */
export const trackSocialInteraction = (network: string, action: string, target?: string): void => {
  analyticsEvent('social_interaction', {
    network,
    action,
    target,
  })
}

/**
 * Track errors
 * @param errorMessage - The error message
 * @param errorType - Type of error (e.g., '404', 'validation', 'server')
 * @param fatal - Whether the error is fatal
 *
 * @example
 * trackError('Page not found', '404', false)
 */
export const trackError = (errorMessage: string, errorType?: string, fatal = false): void => {
  analyticsEvent('error', {
    error_message: errorMessage,
    error_type: errorType,
    fatal,
  })
}
