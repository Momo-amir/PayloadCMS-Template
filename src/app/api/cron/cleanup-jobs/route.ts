/**
 * Cron job to cleanup old Payload jobs
 *
 * This needs to be triggered externally (e.g., Vercel Cron, GitHub Actions, or manual)
 *
 * POST /api/cron/cleanup-jobs
 * Authorization: Bearer ${CRON_SECRET}
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Queue cleanup job

    await payload.jobs.queue({
      workflow: 'cleanupJobs',
      input: {},
    })

    return NextResponse.json({ success: true, message: 'Cleanup job queued' })
  } catch (error) {
    console.error('Cleanup cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
