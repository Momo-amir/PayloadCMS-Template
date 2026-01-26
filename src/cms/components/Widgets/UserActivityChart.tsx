'use client'
import React from 'react'

interface DataPoint {
  date: string
  total: number
  pageViews: number
  interactions: number
  impressions: number
}

interface UserActivityChartProps {
  data: DataPoint[]
  maxValue: number
}

export default function UserActivityChart({ data, maxValue }: UserActivityChartProps) {
  const chartHeight = 200
  const chartWidth = 600
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  if (data.length === 0) {
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

  // Calculate points for each line
  const getYPosition = (value: number) => {
    if (maxValue === 0) return padding.top + innerHeight / 2
    const normalized = value / maxValue
    return padding.top + innerHeight - normalized * innerHeight
  }

  const getXPosition = (index: number) => {
    if (data.length === 1) return padding.left + innerWidth / 2
    return padding.left + (index / (data.length - 1)) * innerWidth
  }

  const createPath = (dataKey: 'total' | 'pageViews' | 'interactions' | 'impressions') => {
    if (data.length === 0) return ''
    return data
      .map((point, index) => {
        const x = getXPosition(index)
        const y = getYPosition(point[dataKey])
        return `${index === 0 ? 'M' : 'L'} ${x},${y}`
      })
      .join(' ')
  }

  const lines = [
    { key: 'total' as const, color: '#3b82f6', label: 'Total Activity', width: 3 },
    { key: 'pageViews' as const, color: '#8b5cf6', label: 'Page Views', width: 2 },
    { key: 'interactions' as const, color: '#10b981', label: 'Interactions', width: 2 },
    { key: 'impressions' as const, color: '#f59e0b', label: 'Component Views', width: 2 },
  ]

  // Generate Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = (maxValue / 4) * i
    return {
      value: Math.round(value),
      y: getYPosition(value),
    }
  })

  // Generate X-axis labels (show every nth label to avoid crowding)
  const xStep = Math.max(1, Math.floor(data.length / 7))
  const xTicks = data.filter((_, i) => i % xStep === 0 || i === data.length - 1)

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width={chartWidth} height={chartHeight} style={{ minWidth: '100%', display: 'block' }}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={chartWidth - padding.right}
              y2={tick.y}
              stroke="var(--theme-elevation-200)"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <text
              x={padding.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              fill="var(--theme-elevation-400)"
              fontSize="11"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xTicks.map((point, i) => {
          const index = data.indexOf(point)
          const x = getXPosition(index)
          const label = new Date(point.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
          return (
            <text
              key={i}
              x={x}
              y={chartHeight - padding.bottom + 20}
              textAnchor="middle"
              fill="var(--theme-elevation-400)"
              fontSize="11"
            >
              {label}
            </text>
          )
        })}

        {/* Lines */}
        {lines.map((line) => (
          <path
            key={line.key}
            d={createPath(line.key)}
            fill="none"
            stroke={line.color}
            strokeWidth={line.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Data points */}
        {lines.map((line) =>
          data.map((point, index) => (
            <circle
              key={`${line.key}-${index}`}
              cx={getXPosition(index)}
              cy={getYPosition(point[line.key])}
              r={3}
              fill={line.color}
            >
              <title>
                {`${line.label}: ${point[line.key]} on ${new Date(point.date).toLocaleDateString()}`}
              </title>
            </circle>
          )),
        )}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          marginTop: '1rem',
          flexWrap: 'wrap',
          fontSize: '0.75rem',
        }}
      >
        {lines.map((line) => (
          <div key={line.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '16px',
                height: `${line.width}px`,
                backgroundColor: line.color,
                borderRadius: '2px',
              }}
            />
            <span style={{ color: 'var(--theme-text)' }}>{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
