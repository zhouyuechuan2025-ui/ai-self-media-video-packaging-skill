import type {CSSProperties, ReactElement} from 'react';
import type {ShellConfig, StructureProps} from './types';

const clamp = (value: number): number => Math.max(0, Math.min(1, value));

const panel: CSSProperties = {
  position: 'relative',
  width: 760,
  minHeight: 340,
  boxSizing: 'border-box',
  overflow: 'hidden',
  borderRadius: 36,
  color: '#f8fafc',
  background: 'linear-gradient(135deg, rgba(7,15,30,.96), rgba(18,35,58,.88))',
  border: '1px solid rgba(148,163,184,.28)',
  boxShadow: '0 28px 80px rgba(2,8,23,.38)',
  padding: '50px 54px',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
};

const Decorations = ({mode, accent, progress}: {mode: ShellConfig['mode']; accent: string; progress: number}) => {
  const p = clamp(progress);
  const common: CSSProperties = {position: 'absolute', pointerEvents: 'none'};
  if (mode === 'split' || mode === 'dual' || mode === 'compare') {
    return <><div style={{...common, left: '50%', top: 32, bottom: 32, width: 2, background: accent, opacity: .5}}/><div style={{...common, left: 40, top: 40, width: 310, height: 310, borderRadius: 28, border: `2px solid ${accent}`, opacity: .16 + p * .2}}/></>;
  }
  if (mode === 'route' || mode === 'timeline' || mode === 'relay') {
    return <><div style={{...common, left: 72, right: 72, bottom: 64, height: 5, borderRadius: 99, background: 'rgba(148,163,184,.25)'}}/><div style={{...common, left: 72, bottom: 64, height: 5, width: `${Math.round(p * 84)}%`, maxWidth: 776, borderRadius: 99, background: accent}}/></>;
  }
  if (mode === 'matrix' || mode === 'steps' || mode === 'sequence') {
    return <div style={{...common, right: 45, bottom: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: 8}}>{[0,1,2,3,4,5].map((index) => <i key={index} style={{height: 26, borderRadius: 8, background: index / 6 < p ? accent : 'rgba(148,163,184,.18)', opacity: .42}}/>)}</div>;
  }
  if (mode === 'evidence' || mode === 'takeover') {
    return <div style={{...common, right: 46, top: 42, width: 250, height: 160, borderRadius: 18, background: 'rgba(248,250,252,.92)', boxShadow: `0 0 0 5px ${accent}22`}}><div style={{height: 22, borderBottom: '1px solid #cbd5e1'}}/><div style={{margin: 22, height: 9, width: '70%', borderRadius: 9, background: '#94a3b8'}}/><div style={{margin: 22, height: 9, width: '46%', borderRadius: 9, background: accent}}/></div>;
  }
  if (mode === 'metric') {
    return <div style={{...common, right: 50, bottom: 52, width: 88, height: 88, borderRadius: '50%', background: `conic-gradient(${accent} ${Math.round(p * 280)}deg, rgba(148,163,184,.16) 0deg)`, opacity: .5}}><i style={{position: 'absolute', inset: 12, borderRadius: '50%', background: '#12233a'}}/></div>;
  }
  if (mode === 'switch') {
    return <div style={{...common, right: 70, top: 64, width: 150, height: 72, borderRadius: 50, background: p > .5 ? accent : '#334155', padding: 8, boxSizing: 'border-box'}}><i style={{display: 'block', width: 56, height: 56, borderRadius: '50%', background: '#fff', transform: `translateX(${p > .5 ? 78 : 0}px)`}}/></div>;
  }
  return <><div style={{...common, width: 320, height: 320, borderRadius: '50%', right: -120, top: -130, background: accent, opacity: .12 + p * .08}}/><div style={{...common, width: 180, height: 8, left: 70, bottom: 52, borderRadius: 99, background: accent, transform: `scaleX(${p})`, transformOrigin: 'left'}}/></>;
};

export const StructureShell = ({config, text, kicker, progress, accent}: StructureProps & {config: ShellConfig}): ReactElement => {
  const p = clamp(progress);
  const isSplit = ['split', 'dual', 'compare'].includes(config.mode);
  const isCompact = ['aside', 'evidence', 'takeover'].includes(config.mode);
  const headlineStyle: CSSProperties = {
    position: 'relative',
    zIndex: 2,
    maxWidth: isSplit ? 410 : isCompact ? 520 : 760,
    margin: config.align === 'center' ? '45px auto 0' : '45px 0 0',
    textAlign: config.align ?? 'left',
    fontSize: config.mode === 'keyword' ? 64 : config.mode === 'impact' ? 56 : 48,
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
    fontWeight: 900,
    opacity: .25 + p * .75,
    transform: `translateY(${Math.round((1 - p) * 20)}px)`,
  };
  return <section data-structure={config.mode} style={panel}>
    <Decorations mode={config.mode} accent={accent} progress={p}/>
    <div style={{position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 14, color: accent, fontSize: 18, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase'}}>
      <span style={{width: 44, height: 3, borderRadius: 9, background: accent}}/>
      {kicker ?? config.eyebrow ?? 'AI VIDEO PACKAGING'}
    </div>
    <h2 style={headlineStyle}>{text}</h2>
    <div style={{position: 'absolute', zIndex: 2, left: 70, right: 70, bottom: 34, display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14, letterSpacing: '.08em'}}>
      <span>{config.mode.replaceAll('-', ' ').toUpperCase()}</span><span>SEEK SAFE</span>
    </div>
  </section>;
};
