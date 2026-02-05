'use client'
import React, { useEffect, useState } from 'react'
import { Card, PillSelector } from '@payloadcms/ui'

interface EventData {
  name: string
  count: number
  parameters: Record<string, Record<string, number>>
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

interface DrilldownProps {
  dataByPeriod: Record<PeriodKey, PeriodData>
  initialPeriod?: PeriodKey
}

const formatNumber = (value: number) => value.toLocaleString()
const getDeltaColor = (current: number, previous: number | undefined, period: PeriodKey) => {
  if (period === 'total') return 'var(--theme-brand-500)'
  if (previous === undefined || previous === 0) return 'var(--theme-elevation-600)'
  if (current > previous) return 'var(--theme-success-500)'
  if (current < previous) return 'var(--theme-error-500)'
  return 'var(--theme-elevation-600)'
}

export default function AnalyticsEventsDrilldown({
  dataByPeriod,
  initialPeriod = '30d',
}: DrilldownProps) {
  const [period, setPeriod] = useState<PeriodKey>(initialPeriod)
  const [currentView, setCurrentView] = useState<'events' | 'parameters' | 'values'>('events')
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setCurrentView('events')
    setSelectedEvent(null)
    setSelectedParameter(null)
    setCurrentPage(1)
  }, [period])

  const activeData = dataByPeriod[period]
  const compare = activeData.compare

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event)
    setCurrentView('parameters')
    setCurrentPage(1)
  }

  const handleParameterClick = (paramKey: string) => {
    setSelectedParameter(paramKey)
    setCurrentView('values')
    setCurrentPage(1)
  }

  const handleBack = () => {
    if (currentView === 'values') {
      setCurrentView('parameters')
      setSelectedParameter(null)
    } else if (currentView === 'parameters') {
      setCurrentView('events')
      setSelectedEvent(null)
    }
    setCurrentPage(1)
  }

  // Get current items based on view
  let items: Array<{ label: string; count: number }> = []
  let title = 'Event Names'

  if (currentView === 'events') {
    items = activeData.events.map((e) => ({ label: e.name, count: e.count }))
    title = 'Event Names'
  } else if (currentView === 'parameters' && selectedEvent) {
    items = Object.entries(selectedEvent.parameters).map(([key, values]) => {
      const count = Object.values(values).reduce((sum, c) => sum + c, 0)
      return { label: key, count }
    })
    title = selectedEvent.name
  } else if (currentView === 'values' && selectedEvent && selectedParameter) {
    const paramValues = selectedEvent.parameters[selectedParameter]
    if (paramValues) {
      items = Object.entries(paramValues).map(([value, count]) => ({ label: value, count }))
    }
    title = selectedParameter
  }

  // Pagination
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div
      className="card widget"
      style={{ padding: '1.5rem', minHeight: '400px', flexDirection: 'column' }}
    >
      {/* Header with breadcrumb */}
      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ margin: 0, color: 'var(--theme-text)' }}>Analytics Events</h3>

        <PillSelector
          pills={[
            { name: 'total', Label: 'Total', selected: period === 'total' },
            { name: '30d', Label: '30 Days', selected: period === '30d' },
            { name: '7d', Label: '7 Days', selected: period === '7d' },
            { name: '24h', Label: '24 Hours', selected: period === '24h' },
          ]}
          onClick={({ pill }) => setPeriod(pill.name as PeriodKey)}
        />
      </div>
      <div className="">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <Card
            title="Pageviews"
            actions={
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: getDeltaColor(activeData.pageviews, compare?.pageviews, period),
                }}
              >
                {formatNumber(activeData.pageviews)}
              </span>
            }
          />
          <Card
            title="Component Impressions"
            actions={
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: getDeltaColor(activeData.impressions, compare?.impressions, period),
                }}
              >
                {formatNumber(activeData.impressions)}
              </span>
            }
          />
          <Card
            title="Interactions"
            actions={
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: getDeltaColor(activeData.interactions, compare?.interactions, period),
                }}
              >
                {formatNumber(activeData.interactions)}
              </span>
            }
          />
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
        >
          {currentView !== 'events' && (
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--theme-text)',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ← Back
            </button>
          )}
          <div
            style={{
              fontSize: '0.8125rem',
              color: 'var(--theme-elevation-400)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <span
              onClick={() => currentView !== 'events' && handleBack()}
              style={{
                cursor: currentView !== 'events' ? 'pointer' : 'default',
                textDecoration: currentView !== 'events' ? 'underline' : 'none',
              }}
            >
              Events
            </span>
            {selectedEvent && (
              <>
                <span>/</span>
                <span
                  onClick={() => currentView === 'values' && handleBack()}
                  style={{
                    cursor: currentView === 'values' ? 'pointer' : 'default',
                    textDecoration: currentView === 'values' ? 'underline' : 'none',
                  }}
                >
                  {selectedEvent.name}
                </span>
              </>
            )}
            {selectedParameter && (
              <>
                <span>/</span>
                <span>{selectedParameter}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary stats */}
        <div
          style={{
            marginTop: '1rem',
            backgroundColor: 'var(--theme-elevation-50)',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>{title}</strong>
          <div style={{ color: 'var(--theme-elevation-400)', marginTop: '0.25rem' }}>
            {currentView === 'events' &&
              `${items.length} event types · ${activeData.totalCount.toLocaleString()} total events`}
            {currentView === 'parameters' &&
              `${items.length} event parameters · ${selectedEvent?.count.toLocaleString()} total events`}
            {currentView === 'values' && `${items.length} unique values`}
          </div>
        </div>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--theme-elevation-400)',
            backgroundColor: 'var(--theme-elevation-50)',
            borderRadius: '4px',
          }}
        >
          No data available
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                padding: '0.5rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--theme-elevation-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid var(--theme-elevation-150)',
              }}
            >
              <div>
                {currentView === 'events' && 'Event Name'}
                {currentView === 'parameters' && 'Event Parameter Key'}
                {currentView === 'values' && 'Event Parameter Value'}
              </div>
              <div style={{ textAlign: 'right' }}>Event Count</div>
            </div>

            {/* Table rows */}
            {paginatedItems.map((item, index) => {
              const isClickable = currentView !== 'values'

              return (
                <div
                  key={`${item.label}-${index}`}
                  onClick={() => {
                    if (currentView === 'events') {
                      const event = activeData.events.find((e) => e.name === item.label)
                      if (event) handleEventClick(event)
                    } else if (currentView === 'parameters') {
                      handleParameterClick(item.label)
                    }
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    padding: '0.75rem',
                    backgroundColor: 'var(--theme-elevation-50)',
                    borderRadius: '4px',
                    border: '1px solid var(--theme-elevation-150)',
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (isClickable) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                      e.currentTarget.style.borderColor = 'var(--theme-elevation-200)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
                    e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: currentView === 'events' ? 'monospace' : 'inherit',
                      fontSize: '0.875rem',
                      color: 'var(--theme-text)',
                      fontWeight: currentView !== 'values' ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {item.label}
                    {isClickable && (
                      <span style={{ color: 'var(--theme-elevation-400)', fontSize: '0.75rem' }}>
                        →
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--theme-text)',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                    }}
                  >
                    {item.count.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--theme-elevation-150)',
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor:
                    currentPage === 1 ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-200)',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? 'var(--theme-elevation-400)' : 'var(--theme-text)',
                  fontSize: '0.875rem',
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-400)' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor:
                    currentPage === totalPages
                      ? 'var(--theme-elevation-100)'
                      : 'var(--theme-elevation-200)',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color:
                    currentPage === totalPages ? 'var(--theme-elevation-400)' : 'var(--theme-text)',
                  fontSize: '0.875rem',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
