import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CONSENT_POLICY_VERSION } from '@/cms/utilities/consent-model'

type PayloadMock = {
  create: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  find: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

const setupRoute = async ({
  body,
  trustedOrigin = true,
  consentToken,
  payload,
}: {
  body: unknown
  trustedOrigin?: boolean
  consentToken?: string
  payload: PayloadMock
}) => {
  vi.resetModules()

  const cookiesGet = vi.fn((name: string) => {
    if (name !== 'consent_token') return undefined
    return consentToken ? { value: consentToken } : undefined
  })

  vi.doMock('payload', () => ({
    getPayload: vi.fn(async () => payload),
  }))
  vi.doMock('@payload-config', () => ({ default: {} }))
  vi.doMock('crypto', () => ({ randomUUID: () => 'test-generated-token' }))
  vi.doMock('next/headers', () => ({
    cookies: vi.fn(async () => ({
      get: cookiesGet,
    })),
  }))
  vi.doMock('@/cms/utilities/isTrustedOrigin', () => ({
    isTrustedOrigin: vi.fn(() => trustedOrigin),
  }))

  const route = await import('@/app/api/consent/route')
  const request = {
    json: async () => body,
    headers: new Headers(),
  }

  return {
    route,
    request,
    cookiesGet,
  }
}

describe('/api/consent route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('accepts legacy boolean body and creates token record', async () => {
    const payload: PayloadMock = {
      create: vi.fn(async () => ({})),
      update: vi.fn(async () => ({})),
      find: vi.fn(async () => ({ docs: [] })),
      delete: vi.fn(async () => ({})),
    }
    const { route, request } = await setupRoute({
      body: { analytics: true },
      payload,
    })

    const response = await route.POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ success: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
    expect(payload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'consent-tokens',
        data: expect.objectContaining({
          token: 'test-generated-token',
          analytics: true,
          analyticsLocalStorage: true,
          analyticsThirdPartySharing: false,
          version: CONSENT_POLICY_VERSION,
        }),
      }),
    )
  })

  it('updates existing token with structured preferences and revokes queued analytics when analytics=false', async () => {
    const payload: PayloadMock = {
      create: vi.fn(async () => ({})),
      update: vi.fn(async () => ({})),
      find: vi.fn(async () => ({ docs: [{ id: 'doc-1' }] })),
      delete: vi.fn(async () => ({})),
    }
    const { route, request } = await setupRoute({
      body: {
        preferences: {
          analytics: false,
          analyticsLocalStorage: true,
          analyticsThirdPartySharing: true,
          marketing: true,
          personalization: true,
        },
      },
      consentToken: 'existing-token',
      payload,
    })

    const response = await route.POST(request as never)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ success: true })
    expect(payload.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'consent-tokens',
        id: 'doc-1',
        data: expect.objectContaining({
          analytics: false,
          analyticsLocalStorage: false,
          analyticsThirdPartySharing: false,
          marketing: true,
          personalization: true,
          version: CONSENT_POLICY_VERSION,
        }),
      }),
    )
    expect(payload.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'payload-jobs',
      }),
    )
  })

  it('returns default preferences for GET when no token exists', async () => {
    const payload: PayloadMock = {
      create: vi.fn(async () => ({})),
      update: vi.fn(async () => ({})),
      find: vi.fn(async () => ({ docs: [] })),
      delete: vi.fn(async () => ({})),
    }
    const { route } = await setupRoute({
      body: {},
      payload,
    })

    const response = await route.GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      preferences: {
        essential: true,
        analytics: false,
        analyticsLocalStorage: false,
        analyticsThirdPartySharing: false,
        marketing: false,
        personalization: false,
      },
      analytics: false,
    })
  })
})
