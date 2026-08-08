import {Frame} from './Frame';
import type {IllustrationProps} from './types';

export const ClimbBoulder = (props: IllustrationProps) => (
  <Frame {...props}>
    <path d="M58 318 210 255 326 195 458 116 585 48" fill="none" />
    <circle cx="270" cy="188" r="24" fill="none" />
    <path d="M265 214 238 262m28-48 43 35m-52-8-35-2m47 4 36 30" fill="none" />
    <circle cx="350" cy="184" r="52" fill="none" />
    <path d="m310 223 22-13M455 116l35-4m-6 24 28-30" fill="none" />
  </Frame>
);
