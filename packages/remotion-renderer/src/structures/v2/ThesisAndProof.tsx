import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {EditorialRule, FullScreenSurface, Kicker, SideSurface, SourceStamp, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

export const ThesisAndProof = ({content, progress, palette, placement}: StructureProps): ReactElement => {
  if (content.structure !== 'thesis-and-proof') throw new Error('ThesisAndProof received incompatible content');
  const thesis = (
    <>
      <Kicker color={palette.line}>CORE THESIS</Kicker>
      <h2 style={{margin: '24px 0 22px', fontSize: 61, lineHeight: 0.98, letterSpacing: '-0.055em', color: palette.foreground, ...rise(phase(progress, 0, 0.42), 38)}}>{content.thesis}</h2>
      <EditorialRule progress={progress} color={palette.accent}/>
    </>
  );
  const proof = (
    <>
      <Kicker color={palette.accent}>WHY IT HOLDS</Kicker>
      <p style={{margin: '23px 0', fontSize: 27, lineHeight: 1.36, fontWeight: 760, color: palette.foreground, ...rise(phase(progress, 0.2, 0.65), 24)}}>{content.reason}</p>
      {content.sourceLabel ? <SourceStamp label={content.sourceLabel} palette={palette}/> : null}
      {content.sourceDetail ? <p style={{fontSize: 17, lineHeight: 1.4, color: palette.muted}}>{content.sourceDetail}</p> : null}
    </>
  );
  if (placement !== 'full') {
    return <AbsoluteFill data-structure-identity="thesis-and-proof" data-critical-content="true" style={typography}><SideSurface side={placement} palette={palette}>{thesis}{proof}</SideSurface></AbsoluteFill>;
  }
  return (
    <AbsoluteFill data-structure-identity="thesis-and-proof" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="opaque" palette={palette}>
        <div style={{position: 'absolute', inset: '10% 9% 10%', display: 'grid', gridTemplateRows: 'auto 1fr auto', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}><Kicker color={palette.line}>CORE THESIS</Kicker><div style={{height: 5, flex: 1, borderRadius: 999, background: `${palette.line}55`}}/></div>
          <div style={{display: 'grid', gridTemplateColumns: '1.7fr .8fr', gap: 70, alignItems: 'center'}}>
            <h2 style={{margin: 0, fontSize: 92, lineHeight: .94, letterSpacing: '-0.065em', color: palette.foreground, ...rise(phase(progress, 0, .42), 48)}}>{content.thesis}</h2>
            <div style={{padding: '30px 28px', borderRadius: 24, background: palette.card, borderLeft: `8px solid ${palette.accent}`, ...rise(phase(progress, .2, .66), 28)}}>
              <Kicker color={palette.accent}>WHY IT HOLDS</Kicker>
              <p style={{margin: '20px 0 0', fontSize: 30, lineHeight: 1.32, fontWeight: 760, color: palette.foreground}}>{content.reason}</p>
              {content.sourceLabel ? <div style={{marginTop: 24}}><SourceStamp label={content.sourceLabel} palette={palette}/></div> : null}
            </div>
          </div>
          <EditorialRule progress={progress} color={palette.accent}/>
        </div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};
