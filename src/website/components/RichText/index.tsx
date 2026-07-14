import { MediaBlock } from '@/website/blocks/Media/Component'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/website/blocks/Code/Component'
import { ColumnsBlock } from '@/website/blocks/Columns/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  ColumnsBlock as ColumnsBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/website/blocks/Banner/Component'
import { CallToActionBlock } from '@/website/blocks/CallToAction/Component'
import { cn } from '@/cms/utilities/ui'
import { getPagePath } from '@/utils/paths'
import type { Page } from '@/payload-types'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps | ColumnsBlockProps
    >

const buildConverters =
  (postsBasePath: string): JSXConvertersFunction<NodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const { value, relationTo } = linkNode.fields.doc!
        if (typeof value !== 'object') {
          throw new Error('Expected value to be an object')
        }
        if (relationTo === 'posts') return `${postsBasePath}/${value.slug}`
        return getPagePath(value as Page)
      },
    }),
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} />,
      columns: ({ node }) => <ColumnsBlock className="col-start-1 col-span-3" {...node.fields} />,
    },
  })

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enable?: boolean
  postsBasePath?: string
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enable = true, enableGutter = true, postsBasePath = '/posts', ...rest } = props

  return (
    <RichTextWithoutBlocks
      converters={buildConverters(postsBasePath)}
      className={cn(
        {
          'container ': enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto   md: -md ': enable,
        },
        className,
      )}
      {...rest}
    />
  )
}
