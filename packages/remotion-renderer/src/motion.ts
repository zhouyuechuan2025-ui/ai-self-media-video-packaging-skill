import {interpolate} from 'remotion';
import type {MotionPrimitive} from '../../core/src/schema';

type MotionInput = {
  name: MotionPrimitive;
  frame: number;
  fps: number;
  startFrame: number;
  durationFrames: number;
};

export type MotionFrame = {
  progress: number;
  opacity: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  blur: number;
  dashOffset: number;
  clip: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const motionFrame = ({name, frame, startFrame, durationFrames}: MotionInput): MotionFrame => {
  const progress = clamp01((frame - startFrame) / Math.max(1, durationFrames));
  const eased = interpolate(progress, [0, 0.7, 1], [0, 0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const base: MotionFrame = {
    progress,
    opacity: progress,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    blur: 0,
    dashOffset: 1 - progress,
    clip: progress,
  };

  switch (name) {
    case 'hit':
      return {...base, opacity: eased, scale: interpolate(eased, [0, 0.7, 1], [1.45, 0.96, 1])};
    case 'slide':
      return {...base, opacity: eased, x: interpolate(eased, [0, 1], [120, 0])};
    case 'lift':
      return {...base, opacity: eased, y: interpolate(eased, [0, 1], [72, 0])};
    case 'stamp':
      return {...base, opacity: eased, scale: interpolate(eased, [0, 0.72, 1], [1.8, 0.92, 1]), rotate: interpolate(eased, [0, 1], [-7, 0])};
    case 'route':
      return {...base, opacity: 1, dashOffset: 1 - eased};
    case 'trace':
      return {...base, opacity: eased, dashOffset: 1 - eased};
    case 'count':
      return {...base, opacity: eased, clip: eased};
    case 'reveal':
      return {...base, opacity: eased, clip: eased};
    case 'relay':
      return {...base, opacity: eased, x: interpolate(eased, [0, 1], [-88, 0])};
    case 'focus':
      return {...base, opacity: eased, blur: interpolate(eased, [0, 1], [18, 0]), scale: interpolate(eased, [0, 1], [0.94, 1])};
  }
};
