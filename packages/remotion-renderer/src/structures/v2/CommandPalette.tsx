import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {Kicker, SideSurface, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

export const CommandPalette = ({content, progress, palette, placement}: StructureProps): ReactElement => {
  if (content.structure !== 'command-palette') throw new Error('CommandPalette received incompatible content');
  const side = placement === 'right' ? 'right' : 'left';
  const focusIndex = Math.min(content.actions.length - 1, Math.floor(phase(progress, 0.1, 0.78) * content.actions.length));
  return (
    <AbsoluteFill data-structure-identity="command-palette" data-critical-content="true" style={typography}>
      <SideSurface side={side} palette={palette}>
        <Kicker color={palette.line}>COMMAND PALETTE</Kicker>
        <h2 style={{margin: '18px 0', fontSize: 35, color: palette.foreground}}>{content.commandTitle}</h2>
        <div style={{display: 'grid', gap: 10}}>
          {content.actions.map((action, index) => {
            const active = index === focusIndex;
            return <div key={`${action}-${index}`} style={{display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, padding: '13px 14px', borderRadius: 13, background: active ? palette.card : `${palette.canvas}77`, border: `1px solid ${active ? palette.accent : palette.line}66`, color: palette.foreground, fontSize: 20, fontWeight: active ? 900 : 680, ...rise(phase(progress, 0.08 + index * 0.1, 0.42 + index * 0.1), 14)}}><span style={{color: active ? palette.accent : palette.muted}}>⌘</span>{action}</div>;
          })}
        </div>
        <div style={{marginTop: 18, marginLeft: 'auto', width: 'fit-content', padding: '10px 13px', borderRadius: 10, background: palette.accent, color: palette.canvas, fontSize: 16, fontWeight: 950, letterSpacing: '0.08em', transform: `scale(${0.75 + phase(progress, 0.72, 1) * 0.25})`}}>{content.resultState}</div>
      </SideSurface>
    </AbsoluteFill>
  );
};
