import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/website/components/elements/checkbox'
import { Label } from '@/website/components/elements/label'
import Link from 'next/link'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import type { PrivacyPolicyField } from '../types'

export const PrivacyPolicy: React.FC<
  PrivacyPolicyField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  linkLabel,
  register,
  required,
  width,
  policyLink,
}) => {
  const props = register(name, { required: required })
  const { setValue } = useFormContext()

  const resolvedLabel = label || 'I agree to the'
  const resolvedLinkLabel = linkLabel || 'privacy policy'
  const resolvedLink = policyLink || '/privacy-policy'

  return (
    <Width width={width}>
      <div className="flex items-center gap-2">
        <CheckboxUi
          defaultChecked={defaultValue}
          id={name}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <Label htmlFor={name}>
          {required && (
            <span className="required">
              * <span className="sr-only">(required)</span>
            </span>
          )}
          {resolvedLabel}{' '}
          <Link className="underline underline-offset-2" href={resolvedLink}>
            {resolvedLinkLabel}
          </Link>
        </Label>
      </div>
      {errors[name] && <Error />}
    </Width>
  )
}
