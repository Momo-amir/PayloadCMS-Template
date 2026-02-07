import type { Country } from 'react-phone-number-input'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/website/components/elements/label'
import { PhoneInput } from '@/website/components/elements/phone-input'
import React from 'react'
import { Controller } from 'react-hook-form'
import { useLocale } from 'next-intl'

import { Error } from '../Error'
import type { PhoneField } from '../types'
import { Width } from '../Width'

export const Phone: React.FC<
  PhoneField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, required, width }) => {
  const locale = useLocale()
  const localeToCountry = {
    da: 'DK',
    en: 'US',
  } as const
  const resolvedDefaultCountry = (localeToCountry[locale as keyof typeof localeToCountry] ??
    undefined) as Country | undefined

  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <PhoneInput
            countrySelectProps={{
              'aria-label': 'Country',
              id: `${name}-country`,
              name: `${name}-country`,
              locale,
            }}
            defaultCountry={resolvedDefaultCountry}
            focusInputOnCountrySelection={false}
            numberInputProps={{
              autoComplete: 'tel',
              id: name,
              name,
              required,
            }}
            onBlur={onBlur}
            onChange={onChange}
            value={value || ''}
          />
        )}
        rules={{ required }}
      />
      {errors[name] && <Error />}
    </Width>
  )
}
