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

export default async function EventTrackerGraphEnhanced({ req }: WidgetServerProps) {
  const { payload } = req

  try {
    // Get analytics aggregates from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { docs: aggregates } = await payload.find({
      collection: 'analytics-aggregates',
      where: {
        date: { greater_than_equal: thirtyDaysAgo.toISOString() },
      },
      limit: 1000,
      sort: '-date',
    })

    // Build event data with parameters
    const eventsMap = new Map<string, EventDataInternal>()
    let totalCount = 0

    aggregates.forEach((doc) => {
      const eventName = doc.event_name
      if (!eventName) return // Skip if event_name is missing

      const count = doc.count || 0
      const metadata = (doc.metadata as Record<string, unknown>) || {}

      totalCount += count

      // Get or create event
      let eventData = eventsMap.get(eventName)
      if (!eventData) {
        eventData = {
          name: eventName,
          count: 0,
          parameters: new Map<string, Map<string, number>>(),
        }
        eventsMap.set(eventName, eventData)
      }

      eventData.count += count

      // Process metadata as parameters
      Object.entries(metadata).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        const stringValue = String(value)

        // Get or create parameter map
        let paramMap = eventData!.parameters.get(key)
        if (!paramMap) {
          paramMap = new Map<string, number>()
          eventData!.parameters.set(key, paramMap)
        }

        // Add value count
        const currentCount = paramMap.get(stringValue) || 0
        paramMap.set(stringValue, currentCount + count)
      })
    })

    // Convert to array and sort by count
    const events: EventData[] = Array.from(eventsMap.values())
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
      .sort((a, b) => b.count - a.count)

    return <AnalyticsEventsDrilldown events={events} totalCount={totalCount} />
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
