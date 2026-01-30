/**
 * Job Cleanup Task
 *
 * Deletes completed jobs older than 30 days to prevent database bloat.
 * Failed jobs (hasError: true) are kept for debugging.
 */

import type { PayloadRequest } from 'payload'

export const cleanupOldJobsTask = {
  slug: 'cleanupOldJobs',
  retries: 0,
  handler: async ({ req }: { req: PayloadRequest }) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Delete completed jobs older than 30 days (keep failed jobs for debugging) TODO decide what to do with failed jobs for long term
    const result = await req.payload.delete({
      collection: 'payload-jobs',
      where: {
        and: [
          { completedAt: { less_than: thirtyDaysAgo.toISOString() } },
          { hasError: { equals: false } },
        ],
      },
    })

    return {
      output: {
        deleted_count: result.docs?.length || 0,
      },
    }
  },
}
