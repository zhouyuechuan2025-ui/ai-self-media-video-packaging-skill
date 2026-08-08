import type {CSSProperties, ReactElement} from 'react';
import type {MotionPrimitive} from '../../../core/src/schema';

export type StructureProps = {
  text: string;
  kicker?: string;
  progress: number;
  accent: string;
};

export type StructureMode =
  | 'impact'
  | 'stamp'
  | 'keyword'
  | 'split'
  | 'sequence'
  | 'aside'
  | 'dual'
  | 'relay'
  | 'steps'
  | 'route'
  | 'switch'
  | 'timeline'
  | 'evidence'
  | 'takeover'
  | 'metric'
  | 'compare'
  | 'matrix'
  | 'complete';

export type StructureDefinition = {
  safeZone: 'left' | 'right' | 'center' | 'full';
  aspectRatios: string[];
  motions: MotionPrimitive[];
  Component: (props: StructureProps) => ReactElement;
};

export type ShellConfig = {
  mode: StructureMode;
  align?: CSSProperties['textAlign'];
  eyebrow?: string;
};
