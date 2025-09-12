import { FC } from "react";
import { ComponentBlock } from "../types/ComponentBlock";
import { Content } from "./Content/config";
import { TwoBlockBlock } from "./TwoBlock/config";
import { MediaBlock } from "./MediaBlock/config";
import { FormBlock } from "./Form/config";
import { CardCarouselBlock } from "./CardCarousel/config";
import { CardBlock } from "./CardBlock/config";
import { CallToAction } from "./CallToAction/config";

export default {
  // Yes, both the types should be here for ideal intellisense
  blocks: <ComponentBlock[]>([
    Content,
    TwoBlockBlock,
    MediaBlock,
    FormBlock,
    CardCarouselBlock,
    CardBlock,
    CallToAction,
  ] satisfies ComponentBlock[]),
}