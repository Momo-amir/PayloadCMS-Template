import type { Field } from 'payload'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { UserLogin } from './Component'

export const UserLoginBlock: ComponentBlock = {
  slug: 'userLoginBlock',
  component: UserLogin,
  imageURL: '/assets/block-icons/password-user.svg',
  interfaceName: 'UserLoginBlock',
  showOnPage: true,
  labels: {
    singular: { en: 'User Login', da: 'Brugerlogin' },
    plural: { en: 'User Logins', da: 'Brugerloginer' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
  ],
}
