import type { WidgetServerProps } from 'payload'
import React from 'react'
import UserActivityChart from '@/cms/components/widgets/UserActivityChart'

interface DataPoint {
  date: string
  total: number
  pageViews: number
  interactions: number
  impressions: number
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
const COPENHAGEN_TZ = 'Europe/Copenhagen'

const normalizeDateKey = (value: string): string => {
  if (!value) return value
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const [datePart] = value.split('T')
  return datePart || value
}

const getDateKeyInTimezone = (date: Date, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value
  return `${year}-${month}-${day}`
}

const shiftDateKey = (dateKey: string, days: number): string => {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(Date.UTC(year || 0, (month || 1) - 1, day || 1))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export default async function EventTrackerGraph({ req }: WidgetServerProps) {
  const { payload } = req

  try {
    const todayKey = getDateKeyInTimezone(new Date(), COPENHAGEN_TZ)
    const thirtyDaysAgoKey = shiftDateKey(todayKey, -29)
    const sevenDaysAgoKey = shiftDateKey(todayKey, -6)

    // Group by date
    const dateMap = new Map<string, DataPoint>()
    let totalEvents = 0
    let recentEvents = 0

    // Get analytics aggregates from last 30 days with pagination.
    // Production can exceed 1000 aggregate docs, which would otherwise hide newer dates.
    let page = 1
    const limit = 1000
    while (true) {
      const { docs, hasNextPage } = await payload.find({
        collection: 'analytics-aggregates',
        where: {
          date: { greater_than_equal: thirtyDaysAgoKey },
        },
        limit,
        page,
        sort: '-date',
      })

      docs.forEach((doc) => {
        // Skip if date or event_name is missing
        if (!doc.date || !doc.event_name) return

        const dateKey = normalizeDateKey(String(doc.date))
        if (dateKey < thirtyDaysAgoKey) return

        const count = doc.count || 0
        const eventName = doc.event_name

        totalEvents += count
        if (dateKey >= sevenDaysAgoKey) recentEvents += count

        let dataPoint = dateMap.get(dateKey)
        if (!dataPoint) {
          dataPoint = {
            date: dateKey,
            total: 0,
            pageViews: 0,
            interactions: 0,
            impressions: 0,
          }
          dateMap.set(dateKey, dataPoint)
        }

        dataPoint.total += count

        if (eventName === 'page_view') {
          dataPoint.pageViews += count
        } else if (eventName === 'component_impression') {
          dataPoint.impressions += count
        } else if (interactionEvents.has(eventName)) {
          dataPoint.interactions += count
        }
      })

      if (!hasNextPage) break
      page += 1
    }

    // Convert to sorted array
    const data = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    // Calculate growth rate
    const oldHalfTotal = data
      .slice(0, Math.floor(data.length / 2))
      .reduce((sum, d) => sum + d.total, 0)
    const newHalfTotal = data
      .slice(Math.floor(data.length / 2))
      .reduce((sum, d) => sum + d.total, 0)
    const growthRate = oldHalfTotal > 0 ? ((newHalfTotal - oldHalfTotal) / oldHalfTotal) * 100 : 0

    return (
      <div className="card widget" style={{ padding: '1.5rem', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, marginBottom: '0.75rem', color: 'var(--theme-text)' }}>
            User Activity Overview
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              fontSize: '0.875rem',
            }}
          >
            <div>
              <div style={{ color: 'var(--theme-elevation-400)', marginBottom: '0.25rem' }}>
                Total Events (30d)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--theme-text)' }}>
                {totalEvents.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--theme-elevation-400)', marginBottom: '0.25rem' }}>
                Last 7 Days
              </div>
              <div
                style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--theme-success-500)' }}
              >
                {recentEvents.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--theme-elevation-400)', marginBottom: '0.25rem' }}>
                Growth Rate
              </div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: growthRate >= 0 ? 'var(--theme-success-500)' : 'var(--theme-error-500)',
                }}
              >
                {growthRate >= 0 ? '+' : ''}
                {growthRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--theme-elevation-400)', marginBottom: '0.25rem' }}>
                Active Days
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--theme-text)' }}>
                {data.length}
              </div>
            </div>
          </div>
        </div>

        {data.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--theme-elevation-400)',
              backgroundColor: 'var(--theme-elevation-50)',
              borderRadius: '4px',
            }}
          >
            No analytics data yet. Activity will appear here once tracking starts.
          </div>
        ) : (
          <UserActivityChart data={data} />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--theme-text)' }}>
          User Activity Overview
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
