import { AccountDetailsBlock } from '../AccountDetails/config'
import { ArchiveBlock } from '../Archive/config'
import { CallToActionBlock } from '../CallToAction/config'
import { FormBlock } from '../Form/config'
import { MediaBlock } from '../Media/config'
import { RichTextBlock } from '../RichText/config'
import { UserLoginBlock } from '../UserLogin/config'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { TwoBlock as TwoColumnBlockComponent } from './Component'
import { EmbedBlock } from '../Embed/config'

export const TwoColumnBlock: ComponentBlock = {
  slug: 'twoColumnBlock',
  dbName: 'twoColumn',
  component: TwoColumnBlockComponent,
  imageURL: '/assets/block-icons/mediaContent.svg',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: { en: 'Two-Column Layout', da: 'To-kolonne layout' },
    plural: { en: 'Two-Column Layouts', da: 'To-kolonne layouts' },
  },
  fields: [
    {
      name: 'left',
      type: 'blocks',
      blocks: [
        ArchiveBlock,
        CallToActionBlock,
        FormBlock,
        MediaBlock,
        RichTextBlock,
        UserLoginBlock,
        AccountDetailsBlock,
        EmbedBlock,
      ],
      label: 'Left Column',
      maxRows: 1,
    },
    {
      name: 'right',
      type: 'blocks',
      blocks: [
        ArchiveBlock,
        CallToActionBlock,
        FormBlock,
        MediaBlock,
        RichTextBlock,
        UserLoginBlock,
        AccountDetailsBlock,
        EmbedBlock,
      ],
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
