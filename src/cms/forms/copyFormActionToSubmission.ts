import type { CollectionBeforeChangeHook } from 'payload'
import type { Form, FormSubmission } from '@/payload-types'
import type { FormActionValue, FormSubmissionWithAction } from './actions'

const resolveFormAction = (form: Form | null | undefined): FormActionValue => {
  if (form && 'action' in form && typeof form.action === 'string') {
    return form.action as FormActionValue
  }
  return 'none'
}

export const copyFormActionToSubmission: CollectionBeforeChangeHook<FormSubmission> = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data

  const formID = data?.form
  if (!formID) return data

  const form = await req.payload.findByID({ collection: 'forms', id: formID })
  const action = resolveFormAction(form as Form)

  return {
    ...(data as FormSubmissionWithAction),
    action,
  }
}
