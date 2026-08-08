import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {SemanticDoodle as DefaultDoodle} from '../../illustrations/SemanticDoodle';
import {FullScreenSurface, Kicker, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

export const SemanticDoodle = ({content, progress, palette, Illustration}: StructureProps): ReactElement => {
  if (content.structure !== 'semantic-doodle') throw new Error('SemanticDoodle received incompatible content');
  const Doodle = Illustration ?? DefaultDoodle;
  return (
    <AbsoluteFill data-structure-identity="semantic-doodle" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="presenter-window" palette={palette}>
        <div style={{position: 'absolute', left: '5%', top: '10%', bottom: '22%', width: '27%', padding: '26px 24px', borderRadius: 28, background: `${palette.surface}e8`, border: `2px solid ${palette.line}88`, boxShadow: `0 25px 70px ${palette.canvas}99`, ...rise(phase(progress, 0, .44), 24)}}>
          <Kicker color={content.accent}>VISUAL METAPHOR</Kicker>
          <div style={{marginTop: 25, fontSize: 43, lineHeight: 1, fontWeight: 950, color: palette.foreground}}>{content.subject}</div>
          <div style={{marginTop: 20, fontSize: 24, lineHeight: 1.25, fontWeight: 760, color: palette.muted}}>{content.action}</div>
          {content.annotation ? <div style={{marginTop: 25, display: 'inline-flex', padding: '9px 12px', borderRadius: 999, background: `${content.accent}25`, color: palette.foreground, fontSize: 16, fontWeight: 850}}>{content.annotation}</div> : null}
        </div>
        <div data-integrated-doodle="true" style={{position: 'absolute', left: '35%', right: '5%', top: '9%', bottom: '23%', padding: '20px 18px 12px', borderRadius: 30, background: `linear-gradient(135deg, ${palette.card}f2, ${palette.surface}e8)`, border: `1px solid ${palette.line}77`, overflow: 'hidden'}}>
          <Doodle progress={progress} accent={content.accent} subject={content.subject} action={content.action} outcome={content.outcome}/>
          <div style={{position: 'absolute', right: 24, bottom: 20, padding: '12px 17px', borderRadius: 12, background: content.accent, color: palette.canvas, fontSize: 22, fontWeight: 950, transform: `scale(${.8 + phase(progress, .64, 1) * .2})`}}>{content.outcome}</div>
        </div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};

