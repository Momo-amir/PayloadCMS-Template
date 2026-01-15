import type { Field } from 'payload'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { UserLogin } from './Component'

export const UserLoginBlock: ComponentBlock = {
  slug: 'UserLogin',
  component: UserLogin,
  imageURL: '/assets/block-icons/password-user.svg',
  interfaceName: 'UserLoginBlock',
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
