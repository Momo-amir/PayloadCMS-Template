export type PhoneField = {
  blockName?: string
  blockType: 'phone'
  label?: string
  name: string
  required?: boolean
  width?: number
}

export type PrivacyPolicyField = {
  blockName?: string
  blockType: 'privacyPolicy'
  defaultValue?: boolean
  label?: string
  linkLabel?: string
  name: string
  policyLink?: string
  required?: boolean
  width?: number
}
