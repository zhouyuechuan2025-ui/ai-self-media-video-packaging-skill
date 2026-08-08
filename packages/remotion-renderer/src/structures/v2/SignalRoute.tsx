import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {FullScreenSurface, Kicker, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

const positions = [
  {x: 180, y: 220},
  {x: 430, y: 530},
  {x: 740, y: 250},
  {x: 1060, y: 530},
  {x: 1320, y: 220},
];

export const SignalRoute = ({content, progress, palette}: StructureProps): ReactElement => {
  if (content.structure !== 'signal-route') throw new Error('SignalRoute received incompatible content');
  const route = phase(progress, 0.12, 0.82);
  const activeIndex = Math.min(content.nodes.length - 1, Math.floor(route * content.nodes.length));
  const points = positions.slice(0, content.nodes.length).map((point) => `${point.x},${point.y}`).join(' ');
  return (
    <AbsoluteFill data-structure-identity="signal-route" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="presenter-window" palette={palette}>
        <div style={{position: 'absolute', left: '6%', top: '7%'}}><Kicker color={palette.line}>{content.routeLabel}</Kicker></div>
        <svg viewBox="0 0 1500 760" style={{position: 'absolute', inset: '8% 7% 14%', width: '86%', height: '70%', overflow: 'visible'}} aria-hidden>
          <polyline points={points} fill="none" stroke={`${palette.line}55`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points={points} fill="none" stroke={palette.accent} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2200" strokeDashoffset={2200 * (1 - route)}/>
          {positions.slice(0, content.nodes.length).map((point, index) => (
            <g key={`${content.nodes[index]}-${index}`} transform={`translate(${point.x} ${point.y})`} opacity={0.24 + phase(progress, 0.06 + index * .1, .34 + index * .1) * .76}>
              <circle r={index === activeIndex ? 66 : 50} fill={palette.canvas} stroke={index === activeIndex ? palette.accent : palette.line} strokeWidth={index === activeIndex ? 11 : 6}/>
              <circle r="14" fill={index === activeIndex ? palette.accent : palette.line}/>
            </g>
          ))}
        </svg>
        <div style={{position: 'absolute', inset: '15% 7% 22%', pointerEvents: 'none'}}>
          {content.nodes.map((node, index) => {
            const point = positions[index];
            return <div key={`${node}-${index}`} style={{position: 'absolute', left: `${(point.x / 1500) * 100}%`, top: `${(point.y / 760) * 100 + 8}%`, transform: 'translate(-50%, 0)', minWidth: 120, padding: '9px 12px', borderRadius: 12, background: `${palette.surface}e8`, border: `1px solid ${palette.line}77`, color: palette.foreground, fontSize: 19, lineHeight: 1.15, textAlign: 'center', fontWeight: 850, ...rise(phase(progress, 0.12 + index * .1, .45 + index * .1), 14)}}>{node}{content.failureNode === node ? <span style={{display: 'block', marginTop: 5, color: palette.accent, fontSize: 13}}>CHECKPOINT</span> : null}</div>;
          })}
        </div>
        <div style={{position: 'absolute', left: '50%', bottom: '20%', transform: 'translateX(-50%)', padding: '13px 22px', borderRadius: 999, background: palette.accent, color: palette.canvas, fontSize: 22, fontWeight: 950}}>{content.result}</div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};

