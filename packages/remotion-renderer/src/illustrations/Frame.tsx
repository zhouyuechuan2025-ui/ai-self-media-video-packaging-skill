import type {ReactNode} from 'react';
import type {IllustrationProps} from './types';

export const Frame = ({progress, accent, children}: IllustrationProps & {children: ReactNode}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g
        fill="none"
        stroke="#f6f8fb"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.35 + p * 0.65}
        style={{strokeDasharray: 900, strokeDashoffset: 900 * (1 - p)}}
      >
        {children}
      </g>
      <circle cx="585" cy="48" r={10 + p * 9} fill={accent} opacity={0.55 + p * 0.45} />
    </svg>
  );
};
