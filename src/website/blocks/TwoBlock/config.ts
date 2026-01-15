import { Archive } from '../ArchiveBlock/config'
import { CallToAction } from '../CallToAction/config'
import { Content } from '../Content/config' // Temporarily kept for backward compatibility
import { FormBlock } from '../Form/config'
import { MediaBlock } from '../MediaBlock/config'
import { RichTextBlockBlock } from '../RichTextBlock/config'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { TwoBlock } from './Component'

export const TwoBlockBlock: ComponentBlock = {
  slug: 'twoBlock',
  component: TwoBlock,
  imageURL: '/assets/block-icons/columns-2.svg',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: 'Two-Column Layout',
    plural: 'Two-Column Layouts',
  },
  fields: [
    {
      name: 'left',
      type: 'blocks',
      blocks: [Archive, CallToAction, Content, FormBlock, MediaBlock, RichTextBlockBlock], // Content kept for backward compatibility
      label: 'Left Column',
      maxRows: 1,
    },
    {
      name: 'right',
      type: 'blocks',
      blocks: [Archive, CallToAction, Content, FormBlock, MediaBlock, RichTextBlockBlock], // Content kept for backward compatibility
      label: 'Right Column',
      maxRows: 1,
    },
    {
      name: 'enableBackground',
      type: 'checkbox',
      label: 'Enable Background',
      defaultValue: false,
    },
    {
      name: 'backgroundMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image/Video',
      admin: {
        condition: (_, siblingData) => siblingData?.enableBackground === true,
        description:
          'Upload a background image or video. If not provided, background variant color will be used.',
      },
    },
    {
      name: 'backgroundVariant',
      type: 'select',
      label: 'Background Color Variant',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Accent', value: 'accent' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Dark', value: 'dark' },
        { label: 'Neutral', value: 'neutral' },
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData?.enableBackground === true && !siblingData?.backgroundMedia,
        description: 'Choose a background color variant when no media is uploaded.',
      },
    },
    {
      name: 'themeMode',
      type: 'select',
      label: 'Theme',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.enableBackground === true,
        description: 'Choose text color theme based on background.',
      },
    },
  ],
}
