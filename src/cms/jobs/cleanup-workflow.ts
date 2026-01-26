/**
 * Job Cleanup Workflow
 *
 * Wraps the cleanup task in a workflow so it can be triggered via autoRun cron.
 */

export const cleanupJobsWorkflow = {
  slug: 'cleanupJobs',
  handler: async ({ tasks }: { tasks: any }) => {
    // Execute cleanup task
    await tasks.cleanupOldJobs('cleanup', {})
  },
}
