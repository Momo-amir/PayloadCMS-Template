'use client'
import React, { useMemo, useState } from 'react'
import { PillSelector } from '@payloadcms/ui'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DataPoint {
  date: string
  total: number
  pageViews: number
  interactions: number
  impressions: number
}

interface UserActivityChartProps {
  data: DataPoint[]
  initialPeriod?: '3d' | '7d' | '30d'
}

type PeriodKey = '3d' | '7d' | '30d'
type SeriesKey = 'total' | 'pageViews' | 'interactions' | 'impressions'

const series = [
  { key: 'total' as const, label: 'Total Activity', color: '#3b82f6', fillOpacity: 0.28 },
  { key: 'pageViews' as const, label: 'Page Views', color: '#8b5cf6', fillOpacity: 0.22 },
  { key: 'interactions' as const, label: 'Interactions', color: '#10b981', fillOpacity: 0.22 },
  { key: 'impressions' as const, label: 'Component Views', color: '#f59e0b', fillOpacity: 0.22 },
]

const formatNumber = (value: number) => value.toLocaleString()
const COPENHAGEN_TZ = 'Europe/Copenhagen'
const DA_LOCALE = 'da-DK'

const toDateKey = (value: string): string => {
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

const dateKeyToDate = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(Date.UTC(year || 0, (month || 1) - 1, day || 1, 12))
}

const formatAxisDate = (dateStr: string, period: PeriodKey) => {
  const date = dateKeyToDate(toDateKey(dateStr))
  if (period === '3d') {
    return date.toLocaleDateString(DA_LOCALE, {
      month: 'short',
      day: 'numeric',
      timeZone: COPENHAGEN_TZ,
    })
  }
  if (period === '7d') {
    return date.toLocaleDateString(DA_LOCALE, {
      month: 'short',
      day: 'numeric',
      timeZone: COPENHAGEN_TZ,
    })
  }
  return date.toLocaleDateString(DA_LOCALE, {
    month: 'short',
    day: 'numeric',
    timeZone: COPENHAGEN_TZ,
  })
}

const formatTooltipDate = (dateStr: string) =>
  dateKeyToDate(toDateKey(dateStr)).toLocaleDateString(DA_LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: COPENHAGEN_TZ,
  })

const getSeriesByLabel = (label: string) => series.find((s) => s.label === label)

const CustomTooltip = ({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: SeriesKey }>
}) => {
  if (!active || !payload || payload.length === 0 || !label) return null
  return (
    <div
      style={{
        backgroundColor: 'var(--theme-elevation-50)',
        borderRadius: '0.25rem',
        border: '1px solid var(--theme-elevation-200)',
        color: 'var(--theme-text-dark)',
        padding: '8px 12px',
        fontSize: '0.875rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ color: 'var(--theme-text-light)', marginBottom: '0.25rem' }}>
        {formatTooltipDate(label)}
      </div>
      <div style={{ display: 'grid', gap: '0.25rem' }}>
        {payload.map((item, index) => {
          const labelText = item.name || ''
          return (
            <div key={`${labelText}-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.color || 'var(--theme-elevation-400)',
                  marginRight: '0.5rem',
                }}
              />
              <span style={{ marginRight: '0.5rem' }}>{labelText}</span>
              <strong>{formatNumber(item.value || 0)}</strong>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function UserActivityChart({ data, initialPeriod = '30d' }: UserActivityChartProps) {
  const [period, setPeriod] = useState<PeriodKey>(initialPeriod)
  const [activeKey, setActiveKey] = useState<SeriesKey | null>(null)

  const filteredData = useMemo(() => {
    if (!data?.length) return []
    const todayKey = getDateKeyInTimezone(new Date(), COPENHAGEN_TZ)
    let startKey = shiftDateKey(todayKey, -29)
    if (period === '3d') startKey = shiftDateKey(todayKey, -2)
    if (period === '7d') startKey = shiftDateKey(todayKey, -6)

    return data.filter((point) => toDateKey(point.date) >= startKey)
  }, [data, period])

  if (filteredData.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--theme-elevation-400)',
          backgroundColor: 'var(--theme-elevation-50)',
          borderRadius: '4px',
        }}
      >
        No activity data available
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          marginBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: '10px',
        }}
      >
        <PillSelector
          pills={[
            { name: '30d', Label: '30d', selected: period === '30d' },
            { name: '7d', Label: '7d', selected: period === '7d' },
            { name: '3d', Label: '3d', selected: period === '3d' },
          ]}
          onClick={({ pill }) => setPeriod(pill.name as PeriodKey)}
        />
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            onMouseMove={(state: any) => {
              if (state?.activePayload && state.activePayload.length > 0) {
                const payloadKey = state.activePayload[0]?.dataKey as SeriesKey | undefined
                if (payloadKey) setActiveKey(payloadKey)
              }
            }}
            onMouseLeave={() => setActiveKey(null)}
          >
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={s.fillOpacity} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--theme-elevation-200)" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatAxisDate(value, period)}
              tick={{ fill: 'var(--theme-elevation-600)' }}
              stroke="var(--theme-elevation-500)"
              style={{ fontSize: '0.75rem' }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="var(--theme-elevation-500)"
              tick={{ fill: 'var(--theme-elevation-600)' }}
              tickFormatter={formatNumber}
              style={{ fontSize: '0.75rem' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={24}
              formatter={(value: string) => (
                <span style={{ color: 'var(--theme-text)' }}>{value}</span>
              )}
              onMouseEnter={(e) => {
                const label = String(e.value)
                const seriesItem = getSeriesByLabel(label)
                if (seriesItem) setActiveKey(seriesItem.key)
              }}
              onMouseLeave={() => setActiveKey(null)}
            />
            {series.map((s) => {
              const isActive = activeKey ? activeKey === s.key : true
              return (
                <Area
                  key={s.key}
                  dataKey={s.key}
                  type="monotone"
                  name={s.label}
                  stroke={s.color}
                  fill={`url(#fill-${s.key})`}
                  strokeWidth={isActive ? 3 : 2}
                  fillOpacity={isActive ? s.fillOpacity + 0.08 : s.fillOpacity}
                  opacity={isActive ? 1 : 0.4}
                  activeDot={{ r: 5 }}
                  dot={{ r: 2, strokeWidth: 1 }}
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
