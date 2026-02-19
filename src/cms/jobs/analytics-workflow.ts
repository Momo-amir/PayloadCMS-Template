/**
 * Analytics Processing Workflow
 *
 * Combines aggregation + external forwarding into a single workflow
 * with automatic retry and failure recovery.
 *
 * If aggregation succeeds but GA4 fails, only GA4 will be retried on next run.
 */

import type { WorkflowConfig } from 'payload'

export const processAnalyticsEventWorkflow = {
  slug: 'processAnalyticsEvent',

  inputSchema: [
    { name: 'event_name', type: 'text', required: true },
    { name: 'page_path', type: 'text', required: true },
    { name: 'event_data', type: 'json', required: true },
    { name: 'country', type: 'text', required: true },
    { name: 'date', type: 'text', required: true },
    { name: 'consent_token', type: 'text', required: true },
    { name: 'store_aggregates', type: 'checkbox', required: true },
    { name: 'ga4_enabled', type: 'checkbox', required: true },
    { name: 'matomo_enabled', type: 'checkbox', required: true },
  ],

  // Workflow-level retries: up to 3 attempts total
  retries: 3,

  handler: async ({ job, req, tasks }) => {
    const input = job.input

    // Re-validate consent at execution time in case it changed after queueing
    const consentRecord = await req.payload.find({
      collection: 'consent-tokens',
      where: {
        and: [
          { token: { equals: input.consent_token } },
          { analytics: { equals: true } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    // Consent missing/revoked/expired: skip all side effects
    if (!consentRecord.docs.length) {
      return
    }

    // Step 1: Aggregate to local DB (if enabled)
    if (input.store_aggregates) {
      await tasks.aggregateAnalyticsEvent('aggregate', {
        input: {
          event_name: input.event_name,
          page_path: input.page_path,
          event_data: input.event_data,
          country: input.country,
          date: input.date,
        },
      })
    }

    // Step 2: Forward to GA4 (if enabled)
    if (input.ga4_enabled) {
      await tasks.forwardToGA4('ga4', {
        input: {
          event_name: input.event_name,
          page_path: input.page_path,
          event_data: input.event_data,
          client_id: input.consent_token.substring(0, 32),
        },
      })
    }

    // Step 3: Forward to Matomo (if enabled)
    if (input.matomo_enabled) {
      await tasks.forwardToMatomo('matomo', {
        input: {
          event_name: input.event_name,
          page_path: input.page_path,
        },
      })
    }
  },
} as WorkflowConfig<'processAnalyticsEvent'>
