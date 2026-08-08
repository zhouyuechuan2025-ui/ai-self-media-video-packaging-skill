import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {FullScreenSurface, Kicker, SourceStamp, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

export const EvidencePanel = ({content, progress, palette, evidence}: StructureProps): ReactElement => {
  if (content.structure !== 'evidence-panel') throw new Error('EvidencePanel received incompatible content');
  const asset = evidence?.src ?? content.evidenceAsset;
  return (
    <AbsoluteFill data-structure-identity="evidence-panel" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="dim" palette={palette}>
        <div style={{position: 'absolute', inset: '6% 6% 11%', display: 'grid', gridTemplateColumns: '1.65fr .72fr', gap: 30}}>
          <div style={{position: 'relative', overflow: 'hidden', borderRadius: 30, background: '#ffffff', border: `3px solid ${palette.line}`, boxShadow: `18px 22px 0 ${palette.accent}33`, ...rise(phase(progress, 0, 0.45), 30)}}>
            <img src={asset} alt={content.caption} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
            <div style={{position: 'absolute', left: 22, right: 22, bottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18}}>
              <SourceStamp label={evidence?.label ?? content.sourceLabel} palette={palette}/>
              <span style={{padding: '9px 13px', borderRadius: 10, background: `${palette.canvas}e8`, color: palette.foreground, fontSize: 17, fontWeight: 850}}>{content.caption}</span>
            </div>
          </div>
          <aside style={{alignSelf: 'center', padding: '31px 28px', borderRadius: 26, background: palette.surface, border: `1px solid ${palette.line}88`, boxShadow: `0 26px 70px ${palette.canvas}88`, ...rise(phase(progress, 0.22, 0.72), 26)}}>
            <Kicker color={palette.accent}>EVIDENCE FIRST</Kicker>
            <div style={{marginTop: 24, fontSize: 39, lineHeight: 1.08, fontWeight: 950, letterSpacing: '-0.035em', color: palette.foreground}}>{content.interpretation}</div>
            <div style={{marginTop: 28, height: 7, width: `${Math.round(phase(progress, 0.45, 0.9) * 100)}%`, borderRadius: 999, background: palette.line}}/>
          </aside>
        </div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};
