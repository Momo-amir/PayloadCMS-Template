import { ComponentBlock } from '@/website/types/ComponentBlock'
import { AccountDetails } from './Component'

export const AccountDetailsBlock: ComponentBlock = {
  slug: 'accountDetailsBlock',
  component: AccountDetails,
  imageURL: '/assets/block-icons/account-details.svg',
  interfaceName: 'AccountDetailsBlock',
  showOnPage: true,
  labels: {
    singular: { en: 'Account Details', da: 'Kontooplysninger' },
    plural: { en: 'Account Details', da: 'Kontooplysninger' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', da: 'Titel' },
    },
  ],
}
