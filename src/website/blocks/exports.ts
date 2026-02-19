import { AccordionGroupBlock } from "./AccordionGroup/config";
import { AccordionBlock } from "./Accordion/config";
import { SearchBlockBlock } from "./SearchBlock/config";
import { PromoStripBlock } from "./PromoStrip/config";
import { RichTextBlockBlock } from './RichTextBlock/config'
import { PeopleArchiveBlock } from './PeopleArchive/config'
/* eslint-disable import/no-anonymous-default-export */
import { UserLoginBlock } from './UserLogin/config'
import { ComponentBlock } from '../types/ComponentBlock'
import { Content } from './Content/config'
import { TwoBlockBlock } from './TwoBlock/config'
import { MediaBlock } from './MediaBlock/config'
import { FormBlock } from './Form/config'
import { CardCarouselBlock } from './CardCarousel/config'
import { CardBlock } from './CardBlock/config'
import { CallToAction } from './CallToAction/config'
import { Archive } from './ArchiveBlock/config'
import { Columns } from './Columns/config'

export default {
  // Yes, both the types should be here for ideal intellisense
  blocks: <ComponentBlock[]>(
    ([
      Archive,
      Content,
      TwoBlockBlock,
      MediaBlock,
      FormBlock,
      CardCarouselBlock,
      CardBlock,
      CallToAction,
      UserLoginBlock,
      PeopleArchiveBlock,
      RichTextBlockBlock,
      Columns,
    PromoStripBlock,
    SearchBlockBlock,
    AccordionBlock,
    AccordionGroupBlock,
    ] satisfies ComponentBlock[])
  ),
}
