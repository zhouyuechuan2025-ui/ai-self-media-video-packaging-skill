import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {FullScreenSurface, Kicker, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

const positions = [
  {x: 180, y: 220},
  {x: 380, y: 520},
  {x: 1120, y: 220},
  {x: 1320, y: 520},
  {x: 1260, y: 350},
];

const routePath = (count: number): string => {
  const segments = [
    'M180 220 C235 300 320 445 380 520',
    'M380 520 C420 82 1080 82 1120 220',
    'M1120 220 C1180 300 1260 445 1320 520',
    'M1320 520 C1345 445 1320 385 1260 350',
  ];
  return segments.slice(0, Math.max(1, count - 1)).join(' ');
};

export const SignalRoute = ({content, progress, palette}: StructureProps): ReactElement => {
  if (content.structure !== 'signal-route') throw new Error('SignalRoute received incompatible content');
  const route = phase(progress, 0.12, 0.82);
  const activeIndex = Math.min(content.nodes.length - 1, Math.floor(route * content.nodes.length));
  const path = routePath(content.nodes.length);
  return (
    <AbsoluteFill data-structure-identity="signal-route" data-critical-content="true" data-route-layout="full-canvas" style={typography}>
      <FullScreenSurface mode="opaque" palette={palette}>
        <div style={{position: 'absolute', left: '6%', top: '7%'}}><Kicker color={palette.line}>{content.routeLabel}</Kicker></div>
        <svg viewBox="0 0 1500 760" style={{position: 'absolute', inset: '8% 7% 14%', width: '86%', height: '70%', overflow: 'visible'}} aria-hidden>
          <path d={path} fill="none" stroke={`${palette.line}55`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d={path} fill="none" stroke={palette.accent} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2600" strokeDashoffset={2600 * (1 - route)}/>
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
        <div style={{position: 'absolute', right: '5%', bottom: '20%', width: '27%', boxSizing: 'border-box', textAlign: 'center', padding: '13px 18px', borderRadius: 999, background: palette.accent, color: palette.canvas, fontSize: 22, fontWeight: 950}}>{content.result}</div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};
