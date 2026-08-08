import type {ReactElement} from 'react';
import type {IllustrationScenario} from '../../../core/src/schema';
import {BeforeAfter} from './BeforeAfter';
import {ClimbBoulder} from './ClimbBoulder';
import {InformationOverload} from './InformationOverload';
import {PaperPlaneRoute} from './PaperPlaneRoute';
import {RouteActivation} from './RouteActivation';
import type {IllustrationProps} from './types';
import {WorkstationBalance} from './WorkstationBalance';

export const illustrationRegistry: Record<IllustrationScenario, (props: IllustrationProps) => ReactElement> = {
  'information-overload': InformationOverload,
  'climb-boulder': ClimbBoulder,
  'workstation-balance': WorkstationBalance,
  'paper-plane-route': PaperPlaneRoute,
  'route-activation': RouteActivation,
  'before-after-illustration': BeforeAfter,
};

export type {IllustrationProps};
