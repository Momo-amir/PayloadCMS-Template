/**
 * Job Cleanup Workflow
 *
 * Wraps the cleanup task in a workflow so it can be triggered via autoRun cron.
 */

import type { WorkflowConfig } from 'payload'

export const cleanupJobsWorkflow = {
  slug: 'cleanupJobs',
  handler: async ({ tasks }) => {
    await tasks.cleanupOldJobs('cleanup', {})
  },
} as WorkflowConfig<'cleanupJobs'>
