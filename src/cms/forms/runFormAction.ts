import type { CollectionAfterChangeHook } from 'payload'
import type { Form, FormSubmission } from '@/payload-types'
import { formActionHandlers, formActions, FormSubmissionWithAction } from './actions'

const formActionValues = new Set(formActions.map((action) => action.value))

export const runFormAction: CollectionAfterChangeHook<FormSubmission> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const submission = doc as FormSubmissionWithAction
  const action = submission.action ?? 'none'

  if (!formActionValues.has(action)) {
    req.payload.logger.warn(`Unknown form action "${action}" on submission ${submission.id}.`)
    return doc
  }

  const handler = formActionHandlers[action]
  if (!handler) return doc

  const formID =
    typeof submission.form === 'object' && submission.form !== null
      ? submission.form.id
      : submission.form

  if (!formID) return doc

  const form = await req.payload.findByID({ collection: 'forms', id: formID })

  await handler({
    form: form as Form,
    req,
    submission,
  })

  return doc
}
