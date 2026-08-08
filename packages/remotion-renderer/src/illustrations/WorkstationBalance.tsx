import {Frame} from './Frame';
import type {IllustrationProps} from './types';

export const WorkstationBalance = (props: IllustrationProps) => (
  <Frame {...props}>
    <rect x="62" y="86" width="208" height="132" rx="18" fill="none" />
    <path d="M166 218v48m-66 0h132M330 266h242M450 80v186m-92-130h184M358 136l-42 78h84l-42-78Zm184 0-42 78h84l-42-78Z" fill="none" />
    <circle cx="166" cy="150" r="27" fill="none" />
  </Frame>
);
