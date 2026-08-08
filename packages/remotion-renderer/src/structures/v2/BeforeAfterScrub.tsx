import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {FullScreenSurface, Kicker, phase, typography} from '../shared';
import type {StructureProps} from '../types';

export const BeforeAfterScrub = ({content, progress, palette}: StructureProps): ReactElement => {
  if (content.structure !== 'before-after-scrub') throw new Error('BeforeAfterScrub received incompatible content');
  const scrub = 18 + phase(progress, 0.12, 0.82) * 64;
  return (
    <AbsoluteFill data-structure-identity="before-after-scrub" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="dim" palette={palette}>
        <div style={{position: 'absolute', inset: '10% 7% 13%', borderRadius: 30, overflow: 'hidden', border: `2px solid ${palette.line}88`, background: palette.surface}}>
          <div style={{position: 'absolute', inset: 0, padding: '7%', background: palette.surface}}><Kicker color={palette.line}>BEFORE</Kicker><div style={{marginTop: 120, maxWidth: '42%', fontSize: 62, lineHeight: 1, fontWeight: 950, color: palette.foreground}}>{content.before}</div></div>
          <div style={{position: 'absolute', inset: 0, padding: '7%', background: palette.card, clipPath: `inset(0 0 0 ${scrub}%)`}}><div style={{marginLeft: '58%'}}><Kicker color={palette.accent}>AFTER</Kicker><div style={{marginTop: 120, fontSize: 62, lineHeight: 1, fontWeight: 950, color: palette.foreground}}>{content.after}</div></div></div>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: `${scrub}%`, width: 8, background: palette.accent, boxShadow: `0 0 34px ${palette.accent}`}}/>
          <div style={{position: 'absolute', left: '50%', bottom: 30, transform: 'translateX(-50%)', padding: '10px 15px', borderRadius: 999, background: palette.canvas, color: palette.foreground, fontSize: 18, fontWeight: 850}}>{content.criterion}{content.delta ? ` · ${content.delta}` : ''}</div>
        </div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};
