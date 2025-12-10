'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/website/components/RichText'
import { Button } from '@/website/components/elements/button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/cms/utilities/getURL'
import { cn } from '@/cms/utilities/ui'
import { trackFormSubmit } from '@/cms/utilities/analytics'
import { usePrivacy } from '@/providers/Privacy'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form?: FormType | null
  introContent?: SerializedEditorState
  isInDarkTheme?: boolean
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType & { enableGutter?: boolean }
> = (props) => {
  const enableGutter = props.enableGutter ?? true

  const { enableIntro, form: formFromProps, introContent, isInDarkTheme = false } = props
  const { cookieConsent } = usePrivacy()

  // Safely derive form fields to avoid destructuring null/undefined during live preview to avoid silently breaking the preview
  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    redirect,
    submitButtonLabel,
  } = formFromProps || {}

  const formMethods = useForm({
    // When form is null/undefined (e.g., during live preview), provide empty defaults
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: (formFromProps?.fields as any) ?? {},
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      if (!formID) {
        setError({ message: 'Form is not configured yet.' })
        return
      }
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            // Track failed form submission
            if (cookieConsent) {
              trackFormSubmit(formFromProps?.title || 'Form', formID || undefined, false)
            }

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          // Track successful form submission
          if (cookieConsent) {
            trackFormSubmit(formFromProps?.title || 'Form', formID || undefined, true)
          }

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [formID, cookieConsent, confirmationType, redirect, formFromProps?.title, router],
  )

  const isFormConfigured = Boolean(formID)

  return (
    <div className={cn('lg:max-w-3xl', { container: enableGutter })}>
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div
        className={cn(
          'p-4 lg:p-6 border border-border rounded-[0.8rem]',
          isInDarkTheme && 'bg-white text-black',
        )}
      >
        {!isFormConfigured ? (
          <div className="text-sm text-muted-foreground">
            Select a form in this block to preview it.
          </div>
        ) : (
          <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === 'message' && (
              <RichText data={confirmationMessage} />
            )}
            {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
            {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
            {!hasSubmitted && (
              <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 last:mb-0">
                  {formFromProps &&
                    formFromProps.fields &&
                    formFromProps.fields?.map((field, index) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                      if (Field) {
                        return (
                          <div className="mb-6 last:mb-0" key={index}>
                            <Field
                              form={formFromProps}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                            />
                          </div>
                        )
                      }
                      return null
                    })}
                </div>

                <Button form={formID} type="submit" variant="outline" className="cursor-pointer">
                  {submitButtonLabel || 'Submit'}
                </Button>
              </form>
            )}
          </FormProvider>
        )}
      </div>
    </div>
  )
}
