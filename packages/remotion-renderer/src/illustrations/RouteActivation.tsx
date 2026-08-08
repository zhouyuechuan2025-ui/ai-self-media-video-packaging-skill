import {Frame} from './Frame';
import type {IllustrationProps} from './types';

export const RouteActivation = (props: IllustrationProps) => (
  <Frame {...props}>
    <path d="M78 180h98l64-94h112l62 174h144" fill="none" />
    <circle cx="78" cy="180" r="24" fill="none" />
    <circle cx="240" cy="86" r="24" fill="none" />
    <circle cx="352" cy="86" r="24" fill="none" />
    <circle cx="414" cy="260" r="24" fill="none" />
    <circle cx="558" cy="260" r="24" fill="none" />
    <path d="m132 144 28 36-28 36m340 8 28 36-28 36" fill="none" />
  </Frame>
);
