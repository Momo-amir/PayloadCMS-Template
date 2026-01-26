import type { WidgetServerProps } from 'payload'
import React from 'react'
import UserActivityChart from '@/cms/components/Widgets/UserActivityChart'

interface DataPoint {
  date: string
  total: number
  pageViews: number
  interactions: number
  impressions: number
}

export default async function EventTrackerGraph({ req }: WidgetServerProps) {
  const { payload } = req

  try {
    // Get date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get analytics aggregates from last 30 days only
    const { docs: aggregates } = await payload.find({
      collection: 'analytics-aggregates',
      where: {
        date: { greater_than_equal: thirtyDaysAgo.toISOString() },
      },
      limit: 1000,
      sort: 'date',
    })

    // Group by date
    const dateMap = new Map<string, DataPoint>()
    let maxValue = 0
    let totalEvents = 0
    let recentEvents = 0
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    aggregates.forEach((doc) => {
      // Skip if date or event_name is missing
      if (!doc.date || !doc.event_name) return

      const docDate = new Date(doc.date)
      if (docDate < thirtyDaysAgo) return

      const dateKey = docDate.toISOString().split('T')[0]!
      const count = doc.count || 0
      const eventName = doc.event_name

      totalEvents += count
      if (docDate >= sevenDaysAgo) recentEvents += count

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
      } else if (
        eventName.includes('click') ||
        eventName === 'form_submit' ||
        eventName === 'scroll_depth'
      ) {
        dataPoint.interactions += count
      }

      maxValue = Math.max(maxValue, dataPoint.total)
    })

    // Convert to sorted array
    const data = Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // Calculate growth rate
    const oldHalfTotal = data
      .slice(0, Math.floor(data.length / 2))
      .reduce((sum, d) => sum + d.total, 0)
    const newHalfTotal = data
      .slice(Math.floor(data.length / 2))
      .reduce((sum, d) => sum + d.total, 0)
    const growthRate = oldHalfTotal > 0 ? ((newHalfTotal - oldHalfTotal) / oldHalfTotal) * 100 : 0

    return (
      <div className="card" style={{ padding: '1.5rem', flexDirection: 'column' }}>
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
          <UserActivityChart data={data} maxValue={maxValue} />
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
