import {Frame} from './Frame';
import type {IllustrationProps} from './types';

export const ClimbBoulder = (props: IllustrationProps) => (
  <Frame {...props}>
    <path d="M48 326 C144 304 220 274 296 229 C392 172 477 113 592 48" fill="none" />
    <g data-doodle-object="climber">
      <circle cx="206" cy="210" r="20" fill="none" />
      <path d="M208 232 L235 273 M224 250 L286 218 M231 261 L292 232 M235 273 L198 312 M235 273 L272 301" fill="none" />
    </g>
    <g data-doodle-object="boulder">
      <circle cx="344" cy="190" r="60" fill={`${props.accent}16`} />
      <path d="M311 159 C338 134 379 147 397 178 C413 208 390 244 355 250 C318 257 286 229 287 194 C288 178 296 168 311 159" fill="none" />
    </g>
    <path d="M403 158 C450 128 492 98 535 68 M510 67 L539 66 L530 94" stroke={props.accent} fill="none" />
    <path d="M286 218 L309 207 M292 232 L312 221" stroke={props.accent} fill="none" />
  </Frame>
);
