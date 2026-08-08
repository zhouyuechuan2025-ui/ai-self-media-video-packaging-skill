import type {CSSProperties} from 'react';

export const presenterSafeZones = {
  center: {startPercent: 35, endPercent: 65},
  left: {startPercent: 5, endPercent: 32},
  right: {startPercent: 68, endPercent: 95},
  subtitleBottomPercent: 18,
} as const;

export const sideLaneStyle = (side: 'left' | 'right'): CSSProperties => ({
  position: 'absolute',
  top: '7%',
  bottom: '18%',
  width: '27%',
  ...(side === 'left' ? {left: '5%'} : {right: '5%'}),
});
