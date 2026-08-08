import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {FullScreenSurface, Kicker, SideSurface, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

export const BidirectionalFlow = ({content, progress, palette}: StructureProps): ReactElement => {
  if (content.structure !== 'bidirectional-flow') throw new Error('BidirectionalFlow received incompatible content');
  const forward = phase(progress, 0.12, 0.58);
  const backward = phase(progress, 0.42, 0.85);
  return (
    <AbsoluteFill data-structure-identity="bidirectional-flow" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="presenter-window" palette={palette}>
        <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} aria-hidden>
          <path d="M 530 270 C 760 90 1160 90 1390 270" fill="none" stroke={palette.accent} strokeWidth="12" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - forward)}/>
          <path d="M 1390 650 C 1160 850 760 850 530 650" fill="none" stroke={palette.line} strokeWidth="9" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - backward)}/>
        </svg>
        <SideSurface side="left" palette={palette}>
          <Kicker color={palette.line}>INPUT</Kicker>
          <h2 style={{fontSize: 48, lineHeight: 1, color: palette.foreground}}>{content.leftLabel}</h2>
          <div style={{fontSize: 21, color: palette.muted, ...rise(forward, 16)}}>{content.forwardAction} →</div>
        </SideSurface>
        <SideSurface side="right" palette={palette}>
          <Kicker color={palette.accent}>OUTPUT</Kicker>
          <h2 style={{fontSize: 48, lineHeight: 1, color: palette.foreground}}>{content.rightLabel}</h2>
          <div style={{fontSize: 21, color: palette.muted, ...rise(backward, 16)}}>← {content.returnAction ?? '反馈'}</div>
          <div style={{position: 'absolute', left: 25, right: 25, bottom: 24, padding: 15, borderRadius: 14, background: palette.card, color: palette.foreground, fontSize: 22, fontWeight: 900}}>{content.result}</div>
        </SideSurface>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};

