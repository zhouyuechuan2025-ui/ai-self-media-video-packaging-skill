import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {FullScreenSurface, Kicker, phase, typography} from '../shared';
import type {StructureProps} from '../types';

export const FourStagePipeline = ({content, progress, palette}: StructureProps): ReactElement => {
  if (content.structure !== 'four-stage-pipeline') throw new Error('FourStagePipeline received incompatible content');
  return (
    <AbsoluteFill data-structure-identity="four-stage-pipeline" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="dim" palette={palette}>
        <div style={{position: 'absolute', inset: '9% 7% 12%', display: 'grid', gridTemplateRows: 'auto 1fr auto'}}>
          <div><Kicker color={palette.line}>OPERATING PIPELINE</Kicker><h2 style={{margin: '15px 0 0', fontSize: 54, color: palette.foreground}}>{content.title}</h2></div>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(${content.stages.length}, 1fr)`, gap: 18, alignItems: 'center'}}>
            {content.stages.map((stage, index) => {
              const active = phase(progress, 0.12 + index * 0.15, 0.4 + index * 0.15);
              return <div key={`${stage}-${index}`} style={{position: 'relative', minHeight: 205, padding: '28px 22px', borderRadius: 24, background: active > 0.5 ? palette.card : palette.surface, border: `2px solid ${active > 0.5 ? palette.accent : palette.line}88`, color: palette.foreground, opacity: 0.24 + active * 0.76, transform: `translateY(${Math.round((1 - active) * 32)}px)`}}><div style={{fontSize: 17, fontWeight: 950, color: palette.line}}>0{index + 1}</div><div style={{marginTop: 45, fontSize: 31, lineHeight: 1.1, fontWeight: 920}}>{stage}</div>{index < content.stages.length - 1 ? <div style={{position: 'absolute', right: -23, top: '50%', width: 28, height: 6, background: palette.accent}}/> : null}</div>;
            })}
          </div>
          <div style={{justifySelf: 'end', padding: '13px 18px', borderRadius: 999, background: palette.accent, color: palette.canvas, fontSize: 20, fontWeight: 950}}>{content.output ?? 'OUTPUT READY'}</div>
        </div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};

