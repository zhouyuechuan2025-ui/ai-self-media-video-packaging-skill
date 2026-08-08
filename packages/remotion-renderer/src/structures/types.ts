import type {ComponentType, ReactElement} from 'react';
import type {MotionPrimitive} from '../../../core/src/schema';
import type {TemplateContent} from '../../../core/src/template-contracts';
import type {Palette} from '../../../core/src/palettes';
import type {IllustrationProps} from '../illustrations/types';
import type {PresentationMode} from '../../../core/src/presentation-contracts';

export type StructureProps = {
  content: TemplateContent;
  progress: number;
  palette: Palette;
  placement: 'left' | 'right' | 'full';
  evidence?: {src: string; label: string; sourceUrl?: string};
  Illustration?: ComponentType<IllustrationProps>;
};
export type StructureDefinition = {
  safeZone: 'side' | 'full';
  presentationMode: PresentationMode;
  aspectRatios: string[];
  motions: MotionPrimitive[];
  Component: (props: StructureProps) => ReactElement;
};
