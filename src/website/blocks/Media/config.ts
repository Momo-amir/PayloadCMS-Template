import { ComponentBlock } from '@/website/types/ComponentBlock'
import { MediaBlock as MediaBlockComponent } from './Component'

export const MediaBlock: ComponentBlock = {
  slug: 'mediaBlock',
  component: MediaBlockComponent,
  interfaceName: 'MediaBlock',
  labels: { singular: { en: 'Media', da: 'Medie' }, plural: { en: 'Medias', da: 'Medieer' } },
  imageURL: '/assets/block-icons/polaroid.svg',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mediaType',
      type: 'radio',
      label: 'Media Type',
      required: true,
      defaultValue: 'image',
      options: [
        {
          label: 'Image',
          value: 'image',
        },
        {
          label: 'Video',
          value: 'video',
        },
      ],
      admin: {
        description: 'Select whether this is an image or video',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: true,
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.mediaType === 'video'
        },
        description: 'Automatically play the video when it loads',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      label: 'Loop',
      defaultValue: true,
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.mediaType === 'video'
        },
        description: 'Loop the video continuously',
      },
    },
    {
      name: 'muted',
      type: 'checkbox',
      label: 'Muted',
      defaultValue: true,
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.mediaType === 'video'
        },
        description: 'Mute the video audio',
      },
    },
    {
      name: 'controls',
      type: 'checkbox',
      label: 'Show Controls',
      defaultValue: false,
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.mediaType === 'video'
        },
        description: 'Show video playback controls',
      },
    },
  ],
}
