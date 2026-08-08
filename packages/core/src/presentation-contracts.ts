import type {SemanticStructure} from './template-contracts';

export type PresentationMode = 'presenter-safe' | 'opaque-full-screen' | 'adaptive';

export const PRESENTATION_MODE_BY_STRUCTURE: Record<SemanticStructure, PresentationMode> = {
  'editorial-dual-rail': 'presenter-safe',
  'thesis-and-proof': 'adaptive',
  'bidirectional-flow': 'opaque-full-screen',
  'command-palette': 'presenter-safe',
  'four-stage-pipeline': 'opaque-full-screen',
  'before-after-scrub': 'opaque-full-screen',
  'evidence-panel': 'opaque-full-screen',
  'metric-odometer': 'presenter-safe',
  'signal-route': 'opaque-full-screen',
  'semantic-doodle': 'opaque-full-screen',
};

export const resolvePresentationMode = (
  structure: SemanticStructure,
  placement: 'left' | 'right' | 'full',
): Exclude<PresentationMode, 'adaptive'> => {
  const mode = PRESENTATION_MODE_BY_STRUCTURE[structure];
  if (mode !== 'adaptive') return mode;
  return placement === 'full' ? 'opaque-full-screen' : 'presenter-safe';
};
