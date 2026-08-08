import type {VisualStructure} from '../../../core/src/schema';
import {
  AdaptiveSteps,
  BeforeAfter,
  CapabilityMatrix,
  ChapterTimeline,
  CompletionRail,
  ContrarianStamp,
  DualConcept,
  EvidencePip,
  EvidenceTakeover,
  GradientKeyword,
  ImpactQuestion,
  KeywordRelay,
  MetricCounter,
  SideInsightCard,
  SignalRoute,
  SplitConflict,
  StateSwitch,
  ThreeBeatHook,
} from './components';
import type {StructureDefinition, StructureProps} from './types';

export const structureRegistry: Record<VisualStructure, StructureDefinition> = {
  'impact-question': {safeZone: 'center', aspectRatios: ['16:9', '9:16'], motions: ['hit', 'reveal'], Component: ImpactQuestion},
  'contrarian-stamp': {safeZone: 'center', aspectRatios: ['16:9', '9:16'], motions: ['stamp', 'focus'], Component: ContrarianStamp},
  'gradient-keyword': {safeZone: 'center', aspectRatios: ['16:9', '9:16'], motions: ['lift', 'focus'], Component: GradientKeyword},
  'split-conflict': {safeZone: 'full', aspectRatios: ['16:9'], motions: ['slide', 'reveal'], Component: SplitConflict},
  'three-beat-hook': {safeZone: 'center', aspectRatios: ['16:9', '9:16'], motions: ['hit', 'relay'], Component: ThreeBeatHook},
  'side-insight-card': {safeZone: 'left', aspectRatios: ['16:9'], motions: ['slide', 'lift'], Component: SideInsightCard},
  'dual-concept': {safeZone: 'full', aspectRatios: ['16:9'], motions: ['slide', 'focus'], Component: DualConcept},
  'keyword-relay': {safeZone: 'center', aspectRatios: ['16:9'], motions: ['relay', 'focus'], Component: KeywordRelay},
  'adaptive-steps': {safeZone: 'right', aspectRatios: ['16:9', '9:16'], motions: ['reveal', 'lift'], Component: AdaptiveSteps},
  'signal-route': {safeZone: 'full', aspectRatios: ['16:9'], motions: ['route', 'trace'], Component: SignalRoute},
  'state-switch': {safeZone: 'right', aspectRatios: ['16:9'], motions: ['slide', 'stamp'], Component: StateSwitch},
  'chapter-timeline': {safeZone: 'full', aspectRatios: ['16:9'], motions: ['route', 'reveal'], Component: ChapterTimeline},
  'evidence-pip': {safeZone: 'left', aspectRatios: ['16:9'], motions: ['lift', 'focus'], Component: EvidencePip},
  'evidence-takeover': {safeZone: 'full', aspectRatios: ['16:9'], motions: ['reveal', 'focus'], Component: EvidenceTakeover},
  'metric-counter': {safeZone: 'center', aspectRatios: ['16:9', '9:16'], motions: ['count', 'hit'], Component: MetricCounter},
  'before-after': {safeZone: 'full', aspectRatios: ['16:9'], motions: ['slide', 'reveal'], Component: BeforeAfter},
  'capability-matrix': {safeZone: 'full', aspectRatios: ['16:9'], motions: ['reveal', 'relay'], Component: CapabilityMatrix},
  'completion-rail': {safeZone: 'center', aspectRatios: ['16:9', '9:16'], motions: ['route', 'stamp'], Component: CompletionRail},
};

export type {StructureProps};
