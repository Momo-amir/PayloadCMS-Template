import { ArchiveBlock } from './ArchiveBlock/Component'
import { CallToActionBlock } from './CallToAction/Component'
import { ContentBlock } from './Content/Component'
import { FormBlock } from './Form/Component'
import { MediaBlock } from './MediaBlock/Component'
import { TwoBlock } from './TwoBlock/Component'

export const blocks = {
  archive: ArchiveBlock,
  cta: CallToActionBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  twoBlock: TwoBlock,
}

// also export each one individually if you need them by name
export { ArchiveBlock, CallToActionBlock, ContentBlock, FormBlock, MediaBlock, TwoBlock }
