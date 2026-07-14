import { ComponentBlock } from '@/website/types/ComponentBlock'
import { CodeBlock as CodeBlockComponent } from './Component'

export const CodeBlock: ComponentBlock = {
  slug: 'codeBlock',
  component: CodeBlockComponent,
  interfaceName: 'CodeBlock',
  labels: { singular: { en: 'Code', da: 'Kode' }, plural: { en: 'Codes', da: 'Kodeer' } },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: 'Typescript',
          value: 'typescript',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'CSS',
          value: 'css',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}
