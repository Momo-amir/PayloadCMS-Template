import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CONSENT_POLICY_VERSION } from '@/cms/utilities/consent-model'

type PayloadMock = {
  find: ReturnType<typeof vi.fn>
  findGlobal: ReturnType<typeof vi.fn>
  jobs: {
    queue: ReturnType<typeof vi.fn>
  }
}

const makeEventBody = (eventName = 'page_view') =>
  JSON.stringify({
    events: [
      {
        event_name: eventName,
        page_path: '/pricing',
        event_data: {},
      },
    ],
  })

const setupRoute = async ({
  payload,
  consentToken = 'token-1',
  trustedOrigin = true,
  body = makeEventBody(),
}: {
  payload: PayloadMock
  consentToken?: string
  trustedOrigin?: boolean
  body?: string
}) => {
  vi.resetModules()

  vi.doMock('payload', () => ({
    getPayload: vi.fn(async () => payload),
  }))
  vi.doMock('@payload-config', () => ({ default: {} }))
  vi.doMock('next/headers', () => ({
    cookies: vi.fn(async () => ({
      get: vi.fn((name: string) =>
        name === 'consent_token' && consentToken ? { value: consentToken } : undefined,
      ),
    })),
  }))
  vi.doMock('@/cms/utilities/isTrustedOrigin', () => ({
    isTrustedOrigin: vi.fn(() => trustedOrigin),
  }))
  vi.doMock('@/cms/utilities/analytics-allowlist', () => ({
    ANALYTICS_ALLOWED_KEYS: new Set<string>(['page_path', 'referrer']),
    validateAllowlist: vi.fn(),
  }))

  const route = await import('@/app/api/analytics/route')
  const request = {
    headers: new Headers({
      host: 'example.com',
      'x-forwarded-for': '127.0.0.1',
    }),
    text: async () => body,
  }

  return { route, request }
}

describe('/api/analytics route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects when analytics consent is not granted', async () => {
    const payload: PayloadMock = {
      find: vi.fn(async () => ({ docs: [{ analytics: false }] })),
      findGlobal: vi.fn(async () => ({ enabled: true })),
      jobs: { queue: vi.fn(async () => ({})) },
    }
    const { route, request } = await setupRoute({ payload })

    const response = await route.POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data).toEqual({ error: 'Analytics consent not given' })
    expect(payload.jobs.queue).not.toHaveBeenCalled()
  })

  it('accepts but queues nothing when all sinks are disabled by consent', async () => {
    const payload: PayloadMock = {
      find: vi.fn(async () => ({
        docs: [
          {
            analytics: true,
            analyticsLocalStorage: false,
            analyticsThirdPartySharing: false,
            version: CONSENT_POLICY_VERSION,
          },
        ],
      })),
      findGlobal: vi.fn(async () => ({
        enabled: true,
        store_aggregates: true,
        ga4_enabled: true,
        matomo_enabled: true,
        anonymize_ip: true,
      })),
      jobs: { queue: vi.fn(async () => ({})) },
    }
    const { route, request } = await setupRoute({ payload })

    const response = await route.POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual({ success: true, queued: 0 })
    expect(payload.jobs.queue).not.toHaveBeenCalled()
  })

  it('queues events with destination flags derived from consent and project config', async () => {
    const payload: PayloadMock = {
      find: vi.fn(async () => ({
        docs: [
          {
            analytics: true,
            analyticsLocalStorage: true,
            analyticsThirdPartySharing: false,
            version: CONSENT_POLICY_VERSION,
          },
        ],
      })),
      findGlobal: vi.fn(async () => ({
        enabled: true,
        store_aggregates: true,
        ga4_enabled: true,
        matomo_enabled: true,
        anonymize_ip: false,
      })),
      jobs: { queue: vi.fn(async () => ({})) },
    }
    const { route, request } = await setupRoute({ payload })

    const response = await route.POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual({ success: true, queued: 1 })
    expect(payload.jobs.queue).toHaveBeenCalledTimes(1)
    expect(payload.jobs.queue).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow: 'processAnalyticsEvent',
        input: expect.objectContaining({
          store_aggregates: true,
          ga4_enabled: false,
          matomo_enabled: false,
        }),
      }),
    )
  })

  it('rejects when consent version is outdated', async () => {
    const payload: PayloadMock = {
      find: vi.fn(async () => ({
        docs: [
          {
            analytics: true,
            analyticsLocalStorage: true,
            analyticsThirdPartySharing: true,
            version: CONSENT_POLICY_VERSION - 1,
          },
        ],
      })),
      findGlobal: vi.fn(async () => ({
        enabled: true,
      })),
      jobs: { queue: vi.fn(async () => ({})) },
    }
    const { route, request } = await setupRoute({ payload })

    const response = await route.POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data).toEqual({ error: 'Consent version is outdated' })
    expect(payload.jobs.queue).not.toHaveBeenCalled()
  })
})
