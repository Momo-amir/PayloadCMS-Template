import type { Block, Field } from 'payload'

const name: Field = {
  name: 'name',
  type: 'text',
  label: 'Name (lowercase, no special characters)',
  required: true,
}

const label: Field = {
  name: 'label',
  type: 'text',
  label: 'Label',
  localized: true,
  defaultValue: 'I agree to the',
}

const linkLabel: Field = {
  name: 'linkLabel',
  type: 'text',
  label: 'Link Label',
  localized: true,
  defaultValue: 'privacy policy',
}

const policyLink: Field = {
  name: 'policyLink',
  type: 'text',
  label: 'Privacy Policy URL',
  defaultValue: '/privacy-policy',
  admin: {
    description: 'Defaults to /privacy-policy',
  },
}

const required: Field = {
  name: 'required',
  type: 'checkbox',
  label: 'Required',
  defaultValue: true,
}

const width: Field = {
  name: 'width',
  type: 'number',
  label: 'Field Width (percentage)',
}

export const privacyPolicyField: Block = {
  slug: 'privacyPolicy',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...linkLabel,
          admin: {
            width: '50%',
          },
        },
        {
          ...policyLink,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          ...required,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'defaultValue',
      type: 'checkbox',
      label: 'Default Value',
      defaultValue: false,
    },
  ],
  labels: {
    plural: 'Privacy Policy Fields',
    singular: 'Privacy Policy',
  },
}
