import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {EditorialRule, Kicker, NumberedItem, SideSurface, phase, typography} from '../shared';
import type {StructureProps} from '../types';

export const EditorialDualRail = ({content, progress, palette}: StructureProps): ReactElement => {
  if (content.structure !== 'editorial-dual-rail') throw new Error('EditorialDualRail received incompatible content');
  return (
    <AbsoluteFill data-structure-identity="editorial-dual-rail" data-critical-content="true" style={typography}>
      <SideSurface side="left" palette={palette} progress={phase(progress, 0, 0.35)}>
        <Kicker color={palette.line}>{content.kicker}</Kicker>
        <h2 style={{margin: '18px 0 22px', fontSize: 43, lineHeight: 1.02, letterSpacing: '-0.045em', color: palette.foreground}}>{content.headline}</h2>
        <EditorialRule progress={progress} color={palette.accent}/>
        <div style={{display: 'grid', gap: 20, marginTop: 24}}>
          {content.leftItems.map((item, index) => (
            <NumberedItem key={`${item.label}-${index}`} index={index + 1} {...item} palette={palette} progress={phase(progress, 0.16 + index * 0.12, 0.55 + index * 0.12)}/>
          ))}
        </div>
      </SideSurface>
      <SideSurface side="right" palette={palette} progress={phase(progress, 0.08, 0.42)}>
        <Kicker color={palette.accent}>ACTION RAIL</Kicker>
        <div style={{display: 'grid', gap: 20, marginTop: 24}}>
          {content.rightItems.map((item, index) => (
            <NumberedItem key={`${item.label}-${index}`} index={index + 1} {...item} palette={palette} progress={phase(progress, 0.25 + index * 0.12, 0.65 + index * 0.12)}/>
          ))}
        </div>
        <div style={{position: 'absolute', left: 25, right: 25, bottom: 26, padding: '16px 18px', borderRadius: 16, background: palette.card, borderLeft: `6px solid ${palette.accent}`, color: palette.foreground, fontSize: 22, lineHeight: 1.25, fontWeight: 900}}>{content.takeaway}</div>
      </SideSurface>
    </AbsoluteFill>
  );
};

