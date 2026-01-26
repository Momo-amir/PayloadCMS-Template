/**
 * Analytics Processing Tasks
 *
 * These tasks handle async processing of analytics events:
 * - Aggregating events to analytics-aggregates collection
 * - Forwarding events to GA4
 * - Forwarding events to Matomo
 *
 * Uses Payload's native Jobs system for retry logic, error handling, and monitoring.
 */

import type { TaskConfig } from 'payload'
import crypto from 'crypto'

function getMetadataHash(data: Record<string, unknown>): string {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')
}

/**
 * Task: Aggregate analytics event to database
 * Finds or creates aggregate record grouped by event+path+date+country+metadata
 */
export const aggregateEventTask = {
  slug: 'aggregateAnalyticsEvent',
  retries: 2,
  inputSchema: [
    { name: 'event_name', type: 'text', required: true },
    { name: 'page_path', type: 'text', required: true },
    { name: 'event_data', type: 'json', required: true },
    { name: 'country', type: 'text', required: true },
    { name: 'date', type: 'text', required: true },
  ],
  outputSchema: [
    { name: 'aggregated', type: 'checkbox', required: true },
    { name: 'aggregate_id', type: 'text' },
  ],
  handler: async ({ input, req }) => {
    const metadataHash = getMetadataHash(
      (input.event_data && typeof input.event_data === 'object' && !Array.isArray(input.event_data)
        ? input.event_data
        : {}) as Record<string, unknown>,
    )

    // Find existing aggregate
    const existing = await req.payload.find({
      collection: 'analytics-aggregates',
      where: {
        and: [
          { event_name: { equals: input.event_name } },
          { page_path: { equals: input.page_path } },
          { date: { equals: input.date } },
          { country: { equals: input.country } },
          { metadata_hash: { equals: metadataHash } },
        ],
      },
      limit: 1,
    })

    const existingDoc = existing.docs[0]

    if (existingDoc?.id) {
      // Increment existing
      await req.payload.update({
        collection: 'analytics-aggregates',
        id: existingDoc.id,
        data: {
          count: (existingDoc.count || 0) + 1,
        },
      })

      return {
        output: {
          aggregated: true,
          aggregate_id: String(existingDoc.id),
        },
      }
    } else {
      // Create new aggregate
      const newAggregate = await req.payload.create({
        collection: 'analytics-aggregates',
        data: {
          event_name: input.event_name,
          page_path: input.page_path,
          count: 1,
          date: input.date,
          country: input.country,
          metadata: input.event_data,
          metadata_hash: metadataHash,
        },
        draft: false,
      })

      return {
        output: {
          aggregated: true,
          aggregate_id: String(newAggregate.id),
        },
      }
    }
  },
} as TaskConfig<'aggregateAnalyticsEvent'>

/**
 * Task: Forward event to GA4 Measurement Protocol
 * Retries 3 times if GA4 API fails
 */
export const forwardToGA4Task = {
  slug: 'forwardToGA4',
  retries: 3, // Retry 3x for external API
  inputSchema: [
    { name: 'event_name', type: 'text', required: true },
    { name: 'page_path', type: 'text', required: true },
    { name: 'event_data', type: 'json', required: true },
    { name: 'client_id', type: 'text', required: true },
  ],
  outputSchema: [
    { name: 'forwarded', type: 'checkbox', required: true },
    { name: 'ga4_response_status', type: 'number' },
  ],
  handler: async ({ input }) => {
    const ga4MeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    const ga4ApiSecret = process.env.GA4_API_SECRET

    if (!ga4MeasurementId || !ga4ApiSecret) {
      // Missing credentials - skip without failing
      return {
        output: {
          forwarded: false,
          ga4_response_status: 0,
        },
      }
    }

    const ga4Payload = {
      client_id: input.client_id,
      events: [
        {
          name: input.event_name,
          params: {
            ...(input.event_data &&
            typeof input.event_data === 'object' &&
            !Array.isArray(input.event_data)
              ? input.event_data
              : {}),
            page_location: input.page_path,
            engagement_time_msec: '100',
          },
        },
      ],
    }

    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4ApiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ga4Payload),
      },
    )

    if (!response.ok) {
      throw new Error(`GA4 API returned ${response.status}: ${response.statusText}`)
    }

    return {
      output: {
        forwarded: true,
        ga4_response_status: response.status,
      },
    }
  },
} as TaskConfig<'forwardToGA4'>

/**
 * Task: Forward event to Matomo
 * Retries 3 times if Matomo API fails
 */
export const forwardToMatomoTask = {
  slug: 'forwardToMatomo',
  retries: 3,
  inputSchema: [
    { name: 'event_name', type: 'text', required: true },
    { name: 'page_path', type: 'text', required: true },
  ],
  outputSchema: [
    { name: 'forwarded', type: 'checkbox', required: true },
    { name: 'matomo_response_status', type: 'number' },
  ],
  handler: async ({ input }) => {
    const matomoUrl = process.env.MATOMO_URL
    const matomoSiteId = process.env.MATOMO_SITE_ID

    if (!matomoUrl || !matomoSiteId) {
      return {
        output: {
          forwarded: false,
          matomo_response_status: 0,
        },
      }
    }

    const params = new URLSearchParams({
      idsite: matomoSiteId,
      rec: '1',
      action_name: input.event_name,
      url: input.page_path,
    })

    const response = await fetch(`${matomoUrl}/matomo.php?${params.toString()}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Matomo API returned ${response.status}`)
    }

    return {
      output: {
        forwarded: true,
        matomo_response_status: response.status,
      },
    }
  },
} as TaskConfig<'forwardToMatomo'>
