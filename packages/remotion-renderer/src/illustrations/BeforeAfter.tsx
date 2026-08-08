import {Frame} from './Frame';
import type {IllustrationProps} from './types';

export const BeforeAfter = (props: IllustrationProps) => (
  <Frame {...props}>
    <rect x="58" y="62" width="220" height="236" rx="24" fill="none" />
    <rect x="362" y="62" width="220" height="236" rx="24" fill="none" />
    <path d="M96 118h144M96 170h96M96 222h120M400 118h144M400 170h144M400 222h144" fill="none" />
    <path d="m294 180 44 0m-18-20 20 20-20 20" fill="none" />
    <circle cx="226" cy="264" r="12" fill="none" />
    <circle cx="530" cy="264" r="12" fill="none" />
  </Frame>
);
