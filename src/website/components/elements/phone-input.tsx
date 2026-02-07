import { cn } from '@/cms/utilities/ui'
import React from 'react'
import PhoneInputBase, { getCountryCallingCode } from 'react-phone-number-input'
import type { Country, FlagProps } from 'react-phone-number-input'
import * as SelectPrimitive from '@radix-ui/react-select'
import {
  Select,
  SelectContent,
  SelectSeparator,
  SelectTrigger,
} from '@/website/components/elements/select'

type CountryOption = {
  value?: string
  label?: string
  divider?: boolean
}

type CountryIconProps = {
  country?: Country
  label: string
  aspectRatio?: number
}

type CountrySelectProps = {
  value?: string
  options: CountryOption[]
  onChange: (value?: string) => void
  onBlur?: React.FocusEventHandler
  onFocus?: React.FocusEventHandler
  disabled?: boolean
  readOnly?: boolean
  name?: string
  id?: string
  locale?: string
  'aria-label'?: string
  iconComponent?: React.ComponentType<CountryIconProps>
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  options,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readOnly,
  name,
  id,
  locale,
  'aria-label': ariaLabel,
  iconComponent: Icon,
}) => {
  const selected = options.find((option) => option.value === value)
  const callingCode = value ? `+${getCountryCallingCode(value as Country)}` : ''
  const displayNames =
    locale && typeof Intl !== 'undefined' && 'DisplayNames' in Intl
      ? new Intl.DisplayNames([locale], { type: 'region' })
      : undefined
  const getCountryLabel = (code?: string) => {
    if (!code) return undefined
    return displayNames?.of(code) || selected?.label || code
  }
  const selectedLabel = getCountryLabel(value)

  const shouldRenderIcon = typeof Icon === 'function'

  return (
    <Select
      disabled={disabled || readOnly}
      name={name}
      onValueChange={(next) => onChange(next)}
      value={value || ''}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-8 w-auto  border-0 bg-transparent  text-sm text-primary focus:border-transparent"
        id={id}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        <span className="flex! items-center gap-2 flex-row">
          {shouldRenderIcon && value && (
            <span className="PhoneInputCountryIcon PhoneInputCountryIcon--border">
              <Icon country={value as Country} label={selectedLabel || value} />
            </span>
          )}
          <span>{callingCode || 'Country'}</span>
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => {
          if (option.divider) {
            return <SelectSeparator key={`divider-${index}`} />
          }
          if (!option.value) {
            return null
          }
          const optionCallingCode = `+${getCountryCallingCode(option.value as Country)}`
          const optionLabel = displayNames?.of(option.value) || option.label || option.value

          return (
            <SelectPrimitive.Item
              className="relative flex w-full cursor-default select-none rounded px-2 py-1.5 text-sm outline-none focus:bg-neutral hover:cursor-pointer data-disabled:pointer-events-none data-disabled:opacity-50"
              key={option.value}
              value={option.value}
            >
              <SelectPrimitive.ItemText>
                <span className="flex gap-3">
                  <span className="flex items-center gap-2 self-center ">
                    {shouldRenderIcon && (
                      <span className="PhoneInputCountryIcon PhoneInputCountryIcon--border">
                        <Icon country={option.value as Country} label={optionLabel} />
                      </span>
                    )}
                    <span className="text-xs opacity-70">{optionCallingCode}</span>
                  </span>
                  <span className="flex-1 min-w-0 whitespace-normal leading-snug">
                    {optionLabel}
                  </span>
                </span>
              </SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          )
        })}
      </SelectContent>
    </Select>
  )
}

const FlagSprite: React.FC<FlagProps> = ({ country, countryName }) => {
  const href = `/flags-sprite.svg#${country}`

  return (
    <svg
      aria-label={countryName}
      className="PhoneInputCountryIconImg"
      role={countryName ? undefined : 'presentation'}
    >
      <use href={href} xlinkHref={href} />
    </svg>
  )
}

const PhoneInput: React.FC<React.ComponentProps<typeof PhoneInputBase>> = ({
  className,
  ...props
}) => {
  return (
    <PhoneInputBase
      className={cn('phone-input', className)}
      countrySelectComponent={CountrySelect}
      flagComponent={FlagSprite}
      {...props}
    />
  )
}

export { PhoneInput }
