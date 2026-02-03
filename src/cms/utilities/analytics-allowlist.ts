const ANALYTICS_ALLOWED_KEYS = new Set([
  // Common campaign/attribution fields
  'campaign',
  'content',
  'medium',
  'source',
  'term',
  'label',
  'category',
  'device',
  'element',
  'value',

  // Button clicks
  'button_name',
  'section',
  'destination_url',
  'is_outbound',

  // Card clicks
  'card_title',
  'card_type',

  // Post events
  'post_title',
  'post_slug',
  'categories',
  'position',
  'list_context',

  // Forms
  'form_name',
  'form_type',
  'success',

  // Search
  'search_term',
  'results_count',

  // Video
  'action',
  'video_title',
  'progress',

  // Component impressions
  'component_name',
  'component_type',

  // Scroll depth / engagement
  'depth_percentage',
  'scroll_depth_percentage',
  'engagement_time_msec',

  // Page view
  'page_title',
  'referrer',
  'viewport_category',

  // Errors
  'error_type',
  'error_message',
  'page_path',
])

const ANALYTICS_REQUIRED_KEYS = [
  // These are the current keys emitted by analytics helpers in analytics-server.ts
  'action',
  'button_name',
  'card_title',
  'card_type',
  'categories',
  'depth_percentage',
  'destination_url',
  'engagement_time_msec',
  'error_message',
  'error_type',
  'form_name',
  'form_type',
  'is_outbound',
  'list_context',
  'page_path',
  'page_title',
  'position',
  'post_slug',
  'post_title',
  'progress',
  'referrer',
  'results_count',
  'scroll_depth_percentage',
  'search_term',
  'section',
  'success',
  'video_title',
  'viewport_category',

  // Component impressions
  'component_name',
  'component_type',
]

let didValidateAllowlist = false

function validateAllowlist(): void {
  if (didValidateAllowlist || process.env.NODE_ENV !== 'development') return
  didValidateAllowlist = true

  const missing = ANALYTICS_REQUIRED_KEYS.filter((key) => !ANALYTICS_ALLOWED_KEYS.has(key))
  if (missing.length > 0) {
    console.warn(
      `[Analytics] Allowlist missing keys used by current tracking helpers: ${missing.join(', ')}`,
    )
  }
}

export { ANALYTICS_ALLOWED_KEYS, validateAllowlist }
