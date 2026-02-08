import type { RelationshipValue, Validate } from 'payload'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { SearchBlock } from './Component'

const validateSearchPage: Validate<RelationshipValue> = (value) => {
  if (!value) {
    return 'Select a page for the Search Path.'
  }
  return true
}

export const SearchBlockBlock: ComponentBlock = {
  slug: 'SearchBlock',
  labels: {
    singular: 'Search Input',
    plural: 'Search Inputs',
  },
  component: SearchBlock,
  imageURL: '/assets/block-icons/input-search.svg',
  interfaceName: 'SearchBlockBlock',
  showOnPage: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      localized: true,
    },
    {
      name: 'searchPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Search Page',
      admin: {
        description: 'Select the page that contains the Search Hero.',
      },
      validate: validateSearchPage,
    },
  ],
}
