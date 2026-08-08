import type {SemanticStructure} from '../../../core/src/template-contracts';
import type {StructureDefinition} from './types';
import {BeforeAfterScrub} from './v2/BeforeAfterScrub';
import {BidirectionalFlow} from './v2/BidirectionalFlow';
import {CommandPalette} from './v2/CommandPalette';
import {EditorialDualRail} from './v2/EditorialDualRail';
import {EvidencePanel} from './v2/EvidencePanel';
import {FourStagePipeline} from './v2/FourStagePipeline';
import {MetricOdometer} from './v2/MetricOdometer';
import {SemanticDoodle} from './v2/SemanticDoodle';
import {SignalRoute} from './v2/SignalRoute';
import {ThesisAndProof} from './v2/ThesisAndProof';

export const structureRegistry: Record<SemanticStructure, StructureDefinition> = {
  'editorial-dual-rail': {safeZone: 'side', presentationMode: 'presenter-safe', aspectRatios: ['16:9'], motions: ['slide', 'reveal'], Component: EditorialDualRail},
  'thesis-and-proof': {safeZone: 'side', presentationMode: 'adaptive', aspectRatios: ['16:9', '9:16'], motions: ['hit', 'focus'], Component: ThesisAndProof},
  'bidirectional-flow': {safeZone: 'full', presentationMode: 'opaque-full-screen', aspectRatios: ['16:9'], motions: ['route', 'relay'], Component: BidirectionalFlow},
  'command-palette': {safeZone: 'side', presentationMode: 'presenter-safe', aspectRatios: ['16:9', '9:16'], motions: ['focus', 'stamp'], Component: CommandPalette},
  'four-stage-pipeline': {safeZone: 'full', presentationMode: 'opaque-full-screen', aspectRatios: ['16:9'], motions: ['route', 'relay'], Component: FourStagePipeline},
  'before-after-scrub': {safeZone: 'full', presentationMode: 'opaque-full-screen', aspectRatios: ['16:9'], motions: ['slide', 'reveal'], Component: BeforeAfterScrub},
  'evidence-panel': {safeZone: 'full', presentationMode: 'opaque-full-screen', aspectRatios: ['16:9'], motions: ['reveal', 'focus'], Component: EvidencePanel},
  'metric-odometer': {safeZone: 'full', presentationMode: 'presenter-safe', aspectRatios: ['16:9', '9:16'], motions: ['count', 'hit'], Component: MetricOdometer},
  'signal-route': {safeZone: 'full', presentationMode: 'opaque-full-screen', aspectRatios: ['16:9'], motions: ['route', 'trace'], Component: SignalRoute},
  'semantic-doodle': {safeZone: 'full', presentationMode: 'opaque-full-screen', aspectRatios: ['16:9'], motions: ['trace', 'lift'], Component: SemanticDoodle},
};

export type {StructureProps} from './types';
