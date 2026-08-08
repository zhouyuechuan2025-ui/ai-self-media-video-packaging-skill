import {Frame} from './Frame';
import type {IllustrationProps} from './types';

export const InformationOverload = (props: IllustrationProps) => (
  <Frame {...props}>
    <circle cx="320" cy="205" r="38" fill="none" />
    <path d="M270 315c12-58 28-76 50-76s38 18 50 76" fill="none" />
    <rect x="88" y="62" width="150" height="76" rx="16" fill="none" />
    <rect x="402" y="70" width="145" height="72" rx="16" fill="none" />
    <rect x="64" y="208" width="148" height="70" rx="16" fill="none" />
    <path d="M260 105h42m36 0h42M320 46v92M216 241h54m100 0h44" fill="none" />
  </Frame>
);
