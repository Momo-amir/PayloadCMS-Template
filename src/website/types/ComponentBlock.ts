import { Block } from 'payload';
import { FC } from 'react';

export interface ComponentBlock extends Block {
  showOnPage?: boolean;
  component: FC<any>;
};