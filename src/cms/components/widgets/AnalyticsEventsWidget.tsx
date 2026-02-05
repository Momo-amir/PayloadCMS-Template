import type { WidgetServerProps } from 'payload'
import React from 'react'
import AnalyticsEventsDrilldown from '@/cms/components/widgets/AnalyticsEventsDrilldown'

interface EventData {
  name: string
  count: number
  parameters: Record<string, Record<string, number>>
}

interface EventDataInternal {
  name: string
  count: number
  parameters: Map<string, Map<string, number>>
}

type PeriodKey = 'total' | '30d' | '7d' | '24h'

type PeriodData = {
  events: EventData[]
  totalCount: number
  pageviews: number
  impressions: number
  interactions: number
  compare?: {
    pageviews: number
    impressions: number
    interactions: number
  }
}

const interactionEvents = new Set([
  'form_submit',
  'search',
  'link_click',
  'button_click',
  'card_click',
  'post_card_click',
  'video_interaction',
])

export default async function EventTrackerGraphEnhanced({ req }: WidgetServerProps) {
  const { payload } = req

  try {
    const now = new Date()
    const since30 = new Date(now)
    since30.setDate(now.getDate() - 29)
    const since7 = new Date(now)
    since7.setDate(now.getDate() - 6)
    const since24 = new Date(now)
    since24.setDate(now.getDate() - 1)

    const prev30Start = new Date(now)
    prev30Start.setDate(now.getDate() - 59)
    const prev30End = new Date(now)
    prev30End.setDate(now.getDate() - 29)

    const prev7Start = new Date(now)
    prev7Start.setDate(now.getDate() - 13)
    const prev7End = new Date(now)
    prev7End.setDate(now.getDate() - 6)

    const prev24Start = new Date(now)
    prev24Start.setDate(now.getDate() - 2)
    const prev24End = new Date(now)
    prev24End.setDate(now.getDate() - 1)

    const periodMaps: Record<PeriodKey, Map<string, EventDataInternal>> = {
      total: new Map(),
      '30d': new Map(),
      '7d': new Map(),
      '24h': new Map(),
    }

    const periodTotals: Record<
      PeriodKey,
      { totalCount: number; pageviews: number; impressions: number; interactions: number }
    > = {
      total: { totalCount: 0, pageviews: 0, impressions: 0, interactions: 0 },
      '30d': { totalCount: 0, pageviews: 0, impressions: 0, interactions: 0 },
      '7d': { totalCount: 0, pageviews: 0, impressions: 0, interactions: 0 },
      '24h': { totalCount: 0, pageviews: 0, impressions: 0, interactions: 0 },
    }

    const previousTotals: Record<
      Exclude<PeriodKey, 'total'>,
      { pageviews: number; impressions: number; interactions: number }
    > = {
      '30d': { pageviews: 0, impressions: 0, interactions: 0 },
      '7d': { pageviews: 0, impressions: 0, interactions: 0 },
      '24h': { pageviews: 0, impressions: 0, interactions: 0 },
    }

    const isInRange = (date: Date, start: Date, endExclusive: Date) =>
      date >= start && date < endExclusive

    const updatePeriod = (period: PeriodKey, doc: any) => {
      const eventName = doc.event_name
      if (!eventName) return
      const count = doc.count || 0
      const metadata = (doc.metadata as Record<string, unknown>) || {}

      periodTotals[period].totalCount += count
      if (eventName === 'page_view') periodTotals[period].pageviews += count
      if (eventName === 'component_impression') periodTotals[period].impressions += count
      if (interactionEvents.has(eventName)) periodTotals[period].interactions += count

      let eventData = periodMaps[period].get(eventName)
      if (!eventData) {
        eventData = {
          name: eventName,
          count: 0,
          parameters: new Map<string, Map<string, number>>(),
        }
        periodMaps[period].set(eventName, eventData)
      }

      eventData.count += count

      Object.entries(metadata).forEach(([key, value]) => {
        if (value === null || value === undefined) return
        const stringValue = String(value)
        let paramMap = eventData!.parameters.get(key)
        if (!paramMap) {
          paramMap = new Map<string, number>()
          eventData!.parameters.set(key, paramMap)
        }
        const currentCount = paramMap.get(stringValue) || 0
        paramMap.set(stringValue, currentCount + count)
      })
    }

    const updatePrevious = (
      period: Exclude<PeriodKey, 'total'>,
      doc: any,
    ) => {
      const eventName = doc.event_name
      if (!eventName) return
      const count = doc.count || 0

      if (eventName === 'page_view') previousTotals[period].pageviews += count
      if (eventName === 'component_impression') previousTotals[period].impressions += count
      if (interactionEvents.has(eventName)) previousTotals[period].interactions += count
    }

    let page = 1
    const limit = 1000
    while (true) {
      const { docs, hasNextPage } = await payload.find({
        collection: 'analytics-aggregates',
        limit,
        page,
        sort: '-date',
      })

      docs.forEach((doc) => {
        if (!doc?.date || !doc?.event_name) return
        const docDate = new Date(doc.date)

        updatePeriod('total', doc)
        if (docDate >= since30) updatePeriod('30d', doc)
        if (docDate >= since7) updatePeriod('7d', doc)
        if (docDate >= since24) updatePeriod('24h', doc)

        if (isInRange(docDate, prev30Start, prev30End)) updatePrevious('30d', doc)
        if (isInRange(docDate, prev7Start, prev7End)) updatePrevious('7d', doc)
        if (isInRange(docDate, prev24Start, prev24End)) updatePrevious('24h', doc)
      })

      if (!hasNextPage) break
      page += 1
    }

    const toPeriodData = (map: Map<string, EventDataInternal>, total: PeriodKey): PeriodData => ({
      events: Array.from(map.values())
        .map((event) => ({
          name: event.name,
          count: event.count,
          parameters: Object.fromEntries(
            Array.from(event.parameters.entries()).map(([key, valueMap]) => [
              key,
              Object.fromEntries(valueMap.entries()),
            ]),
          ),
        }))
        .sort((a, b) => b.count - a.count),
      totalCount: periodTotals[total].totalCount,
      pageviews: periodTotals[total].pageviews,
      impressions: periodTotals[total].impressions,
      interactions: periodTotals[total].interactions,
    })

    const dataByPeriod: Record<PeriodKey, PeriodData> = {
      total: toPeriodData(periodMaps.total, 'total'),
      '30d': {
        ...toPeriodData(periodMaps['30d'], '30d'),
        compare: previousTotals['30d'],
      },
      '7d': {
        ...toPeriodData(periodMaps['7d'], '7d'),
        compare: previousTotals['7d'],
      },
      '24h': {
        ...toPeriodData(periodMaps['24h'], '24h'),
        compare: previousTotals['24h'],
      },
    }

    return <AnalyticsEventsDrilldown dataByPeriod={dataByPeriod} initialPeriod="30d" />
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--theme-text)' }}>
          Analytics Events
        </h3>
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--theme-error-500)',
            backgroundColor: 'var(--theme-elevation-50)',
            borderRadius: '4px',
          }}
        >
          Error loading analytics data
        </div>
      </div>
    )
  }
}
