import React from 'react'
import RichText from '@/website/components/RichText'
import { CMSLink, type CMSLinkType } from '@/website/components/Link'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface RichTextBlockProps {
  richText?: SerializedEditorState
  links?: Array<{ link: CMSLinkType }>
  enableGutter?: boolean
}

export const RichTextBlock: React.FC<RichTextBlockProps> = (props) => {
  const { richText, links, enableGutter = true } = props

  if (!richText) return null

  return (
    <div className={enableGutter ? '' : ''}>
      <RichText data={richText} enableGutter={enableGutter} className="text-primary" />
      {links && links.length > 0 && (
        <div className="flex gap-4 mt-6">
          {links.map(({ link }, i) => (
            <CMSLink
              key={i}
              {...link}
              trackingName={link?.label || `Rich Text CTA ${i + 1}`}
              trackingSection="Rich Text Block"
            />
          ))}
        </div>
      )}
    </div>
  )
}
