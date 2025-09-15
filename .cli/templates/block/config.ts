import type { Field } from 'payload'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { {{BLOCK}} } from './Component'

export const {{BLOCK}}Block: ComponentBlock = {
  slug: '{{BLOCK}}',
  component: {{BLOCK}},
  interfaceName: '{{BLOCK}}Block',
  showOnPage: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
  ],
}