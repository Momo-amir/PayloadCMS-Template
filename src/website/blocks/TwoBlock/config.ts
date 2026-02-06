import { Archive } from '../ArchiveBlock/config'
import { CallToAction } from '../CallToAction/config'
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
      blocks: [Archive, CallToAction, FormBlock, MediaBlock, RichTextBlockBlock],
      label: 'Left Column',
      maxRows: 1,
    },
    {
      name: 'right',
      type: 'blocks',
      blocks: [Archive, CallToAction, FormBlock, MediaBlock, RichTextBlockBlock],
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
      name: 'backgroundMode',
      type: 'radio',
      label: 'Background Mode',
      defaultValue: 'color',
      options: [
        { label: 'Color', value: 'color' },
        { label: 'Image/Video', value: 'media' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.enableBackground === true,
      },
    },
    {
      name: 'backgroundMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image/Video',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.enableBackground === true && siblingData?.backgroundMode === 'media',
        description: 'Upload a background image or video.',
      },
    },
    {
      name: 'textColorMode',
      type: 'radio',
      label: 'Text Color',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Black', value: 'black' },
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData?.enableBackground === true && siblingData?.backgroundMode === 'media',
        description: 'Choose text color when using a background image or video.',
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
          siblingData?.enableBackground === true && siblingData?.backgroundMode !== 'media',
        description: 'Choose a background color variant.',
      },
    },
  ],
}
