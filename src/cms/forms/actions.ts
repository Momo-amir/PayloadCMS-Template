import type { PayloadRequest } from 'payload'
import type { Form, FormSubmission } from '@/payload-types'

export const formActions = [
  { label: 'None', value: 'none' },
  { label: 'Newsletter Signup', value: 'newsletter' },
] as const

export const formActionOptions = formActions.map((action) => ({ ...action }))

export type FormActionValue = (typeof formActions)[number]['value']

export type FormSubmissionWithAction = FormSubmission & {
  action?: FormActionValue | null
}

export type FormActionHandler = (args: {
  form: Form
  req: PayloadRequest
  submission: FormSubmissionWithAction
}) => Promise<void> | void

export const formActionHandlers: Record<FormActionValue, FormActionHandler> = {
  none: () => {},
  newsletter: ({ req, submission, form }) => {
    req.payload.logger.info(
      `Form action "newsletter" triggered for form ${form.id} and submission ${submission.id}.`,
    )
  },
}
