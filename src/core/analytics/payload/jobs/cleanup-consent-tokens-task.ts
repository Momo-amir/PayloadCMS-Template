/**
 * Consent Token Cleanup Task
 *
 * Deletes expired consent tokens to comply with GDPR data minimization.
 * Runs automatically once a week (Sundays at 2 AM UTC).
 * Tokens expire 12 months after creation/last update.
 */

import type { PayloadRequest } from 'payload'

export const cleanupExpiredConsentTokensTask = {
  slug: 'cleanupExpiredConsentTokens',
  schedule: [
    {
      cron: '0 2 * * 0', // Every Sunday at 2:00 AM UTC
      queue: 'default',
    },
  ],
  retries: 0,
  handler: async ({ req }: { req: PayloadRequest }) => {
    const now = new Date().toISOString()

    // Delete consent tokens that have passed their expiry date
    const result = await req.payload.delete({
      collection: 'consent-tokens',
      where: {
        expiresAt: {
          less_than: now,
        },
      },
    })

    return {
      output: {
        deleted_count: result.docs?.length || 0,
        timestamp: now,
      },
    }
  },
}
