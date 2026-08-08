import type {ReactElement} from 'react';
import {StructureShell} from './StructureShell';
import type {ShellConfig, StructureProps} from './types';

const make = (config: ShellConfig) => (props: StructureProps): ReactElement => <StructureShell {...props} config={config}/>;

export const ImpactQuestion = make({mode: 'impact', align: 'center', eyebrow: 'HOOK / QUESTION'});
export const ContrarianStamp = make({mode: 'stamp', align: 'center', eyebrow: 'CONTRARIAN / STAMP'});
export const GradientKeyword = make({mode: 'keyword', align: 'center', eyebrow: 'KEYWORD / FOCUS'});
export const SplitConflict = make({mode: 'split', eyebrow: 'CONFLICT / SPLIT'});
export const ThreeBeatHook = make({mode: 'sequence', eyebrow: 'HOOK / THREE BEATS'});
export const SideInsightCard = make({mode: 'aside', eyebrow: 'INSIGHT / ASIDE'});
export const DualConcept = make({mode: 'dual', eyebrow: 'CONCEPT / DUAL'});
export const KeywordRelay = make({mode: 'relay', eyebrow: 'KEYWORD / RELAY'});
export const AdaptiveSteps = make({mode: 'steps', eyebrow: 'PROCESS / STEPS'});
export const SignalRoute = make({mode: 'route', eyebrow: 'SYSTEM / ROUTE'});
export const StateSwitch = make({mode: 'switch', eyebrow: 'STATE / SWITCH'});
export const ChapterTimeline = make({mode: 'timeline', eyebrow: 'CHAPTER / TIMELINE'});
export const EvidencePip = make({mode: 'evidence', eyebrow: 'EVIDENCE / PIP'});
export const EvidenceTakeover = make({mode: 'takeover', eyebrow: 'EVIDENCE / TAKEOVER'});
export const MetricCounter = make({mode: 'metric', eyebrow: 'METRIC / COUNTER'});
export const BeforeAfter = make({mode: 'compare', eyebrow: 'BEFORE / AFTER'});
export const CapabilityMatrix = make({mode: 'matrix', eyebrow: 'CAPABILITY / MATRIX'});
export const CompletionRail = make({mode: 'complete', align: 'center', eyebrow: 'COMPLETE / CHECK'});
