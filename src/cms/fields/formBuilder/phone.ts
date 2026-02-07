import type { Block, Field } from 'payload'

const name: Field = {
  name: 'name',
  type: 'text',
  label: 'Name (lowercase, no special characters)',
  required: true,
  defaultValue: 'phone',
}

const label: Field = {
  name: 'label',
  type: 'text',
  label: 'Label',
  localized: true,
  defaultValue: 'Phone number',
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

export const phoneField: Block = {
  slug: 'phone',
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
  ],
  labels: {
    plural: 'Phone Fields',
    singular: 'Phone',
  },
}
