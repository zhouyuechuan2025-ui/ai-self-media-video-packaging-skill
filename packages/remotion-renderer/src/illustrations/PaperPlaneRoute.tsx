import {Frame} from './Frame';
import type {IllustrationProps} from './types';

export const PaperPlaneRoute = (props: IllustrationProps) => (
  <Frame {...props}>
    <path d="M62 282c112 6 123-145 241-128s128 134 276 17" fill="none" />
    <path d="m410 108 154-64-65 151-31-51-58-36Zm58 36 96-100" fill="none" />
    <path d="M74 226h72M54 184h112M92 142h78" fill="none" />
    <circle cx="302" cy="154" r="14" fill="none" />
  </Frame>
);
