import type {ReactElement} from 'react';
import {CompletionFamily, EditorialFamily, GradientFamily, ImpactFamily, RouteFamily, SupportingFamily} from './families';
import type {StructureProps} from './types';

const make = (Component: (props: StructureProps) => ReactElement) => (props: StructureProps): ReactElement => <Component {...props}/>;

export const ImpactQuestion = make(ImpactFamily);
export const ContrarianStamp = make(EditorialFamily);
export const GradientKeyword = make(GradientFamily);
export const SplitConflict = make(SupportingFamily);
export const ThreeBeatHook = make(ImpactFamily);
export const SideInsightCard = make(GradientFamily);
export const DualConcept = make(SupportingFamily);
export const KeywordRelay = make(GradientFamily);
export const AdaptiveSteps = make(SupportingFamily);
export const SignalRoute = make(RouteFamily);
export const StateSwitch = make(EditorialFamily);
export const ChapterTimeline = make(CompletionFamily);
export const EvidencePip = make(SupportingFamily);
export const EvidenceTakeover = make(SupportingFamily);
export const MetricCounter = make(GradientFamily);
export const BeforeAfter = make(SupportingFamily);
export const CapabilityMatrix = make(SupportingFamily);
export const CompletionRail = make(CompletionFamily);
