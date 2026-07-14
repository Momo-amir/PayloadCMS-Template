import { AccordionBlock } from './Accordion/config'
import { PromoStripBlock } from './PromoStrip/config'
import { RichTextBlock } from './RichText/config'
import { PeopleArchiveBlock } from './PeopleArchive/config'
/* eslint-disable import/no-anonymous-default-export */
import { UserLoginBlock } from './UserLogin/config'
import { ComponentBlock } from '../types/ComponentBlock'
import { ContentBlock } from './Content/config'
import { TwoColumnBlock } from './TwoColumn/config'
import { MediaBlock } from './Media/config'
import { FormBlock } from './Form/config'
import { CardCarouselBlock } from './CardCarousel/config'
import { CardBlock } from './Card/config'
import { CallToActionBlock } from './CallToAction/config'
import { ArchiveBlock } from './Archive/config'
import { ColumnsBlock } from './Columns/config'

export default {
  // Yes, both the types should be here for ideal intellisense
  blocks: <ComponentBlock[]>(
    ([
      ArchiveBlock,
      ContentBlock,
      TwoColumnBlock,
      MediaBlock,
      FormBlock,
      CardCarouselBlock,
      CardBlock,
      CallToActionBlock,
      UserLoginBlock,
      PeopleArchiveBlock,
      RichTextBlock,
      ColumnsBlock,
      PromoStripBlock,
      AccordionBlock,
    ] satisfies ComponentBlock[])
  ),
}
