import type {CSSProperties, ReactElement} from 'react';
import type {StructureProps} from './types';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const rise = (progress: number, distance = 28): CSSProperties => ({
  opacity: .12 + clamp(progress) * .88,
  transform: `translateY(${Math.round((1 - clamp(progress)) * distance)}px)`,
});

const type: CSSProperties = {
  fontFamily: 'Inter, "Noto Sans SC", ui-sans-serif, system-ui, sans-serif',
  boxSizing: 'border-box',
};

const Kicker = ({children, color}: {children: string; color: string}) => (
  <div style={{fontSize: 17, lineHeight: 1, fontWeight: 900, letterSpacing: '.14em', color, textTransform: 'uppercase'}}>{children}</div>
);

export const ImpactFamily = ({text, kicker, progress, palette}: StructureProps): ReactElement => {
  const p = clamp(progress);
  return <section data-visual-family="impact" style={{...type, position: 'relative', flex: 1, overflow: 'hidden', padding: '8% 9%', color: palette.foreground, background: palette.canvas}}>
    <div style={{position: 'absolute', inset: 0, opacity: .2, backgroundImage: `linear-gradient(${palette.line}33 1px, transparent 1px),linear-gradient(90deg,${palette.line}33 1px,transparent 1px)`, backgroundSize: '72px 72px'}}/>
    <div style={{position: 'relative', zIndex: 2, maxWidth: '76%', ...rise(p, 90)}}>
      <Kicker color={palette.line}>{kicker ?? 'IMPACT QUESTION'}</Kicker>
      <h2 style={{margin: '24px 0 0', fontSize: 112, lineHeight: .92, letterSpacing: '-.065em', fontWeight: 950, textTransform: 'uppercase'}}>{text}</h2>
    </div>
    <div style={{position: 'absolute', right: '8%', bottom: '13%', padding: '20px 26px', border: `7px solid ${palette.accent}`, color: palette.accent, fontSize: 30, fontWeight: 950, letterSpacing: '.05em', transform: `scale(${.72 + p * .28}) rotate(${(1 - p) * -8}deg)`, opacity: p}}>KEY SHIFT</div>
  </section>;
};

export const GradientFamily = ({text, kicker, progress, palette, placement}: StructureProps): ReactElement => {
  const align = placement === 'right' ? 'right' : 'left';
  return <section data-visual-family="gradient" style={{...type, position: 'relative', width: 500, minHeight: 330, color: palette.foreground, textAlign: align, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...rise(progress)}}>
    <Kicker color={palette.line}>{kicker ?? 'KEYWORD'}</Kicker>
    <h2 style={{margin: '24px 0 0', fontSize: 70, lineHeight: .94, letterSpacing: '-.06em', fontWeight: 950, color: palette.accent, textShadow: `0 8px 34px ${palette.canvas}bb`}}>{text}</h2>
    <div style={{alignSelf: placement === 'right' ? 'flex-end' : 'flex-start', marginTop: 28, width: `${35 + clamp(progress) * 65}%`, height: 8, borderRadius: 99, background: `linear-gradient(90deg,${palette.accent},${palette.line})`}}/>
  </section>;
};

export const RouteFamily = ({text, kicker, progress, palette}: StructureProps): ReactElement => {
  const p = clamp(progress);
  return <section data-visual-family="route" style={{...type, position: 'relative', flex: 1, overflow: 'hidden', color: palette.foreground}}>
    <div style={{position: 'absolute', left: '6%', top: '9%', width: '27%'}}><Kicker color={palette.line}>{kicker ?? 'SIGNAL ROUTE'}</Kicker><h2 style={{margin: '18px 0 0', fontSize: 56, lineHeight: 1, letterSpacing: '-.05em', fontWeight: 950}}>{text}</h2></div>
    <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', fill: 'none'}} aria-hidden="true">
      <path d="M130 650 C370 410 500 760 650 610 C770 490 790 420 960 420 C1130 420 1150 700 1320 610 C1500 510 1630 430 1790 620" pathLength="1" fill="none" stroke={palette.line} strokeWidth="10" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - p} style={{fill: 'none', filter: `drop-shadow(0 0 14px ${palette.line})`}}/>
    </svg>
    {[{x:'9%',n:'01'},{x:'27%',n:'02'},{x:'72%',n:'03'},{x:'90%',n:'04'}].map((node, index) => <div key={node.n} style={{position: 'absolute', left: node.x, top: index % 2 ? '61%' : '53%', width: 78, height: 78, borderRadius: '50%', display: 'grid', placeItems: 'center', color: palette.canvas, background: index / 4 < p ? palette.accent : palette.card, border: `3px solid ${palette.line}`, fontSize: 20, fontWeight: 950, transform: `translate(-50%,-50%) scale(${.72 + p * .28})`}}>{node.n}</div>)}
  </section>;
};

export const EditorialFamily = ({text, kicker, progress, palette, placement}: StructureProps): ReactElement => {
  const p = clamp(progress);
  return <section data-visual-family="editorial" style={{...type, position: 'relative', width: placement === 'full' ? '100%' : 500, minHeight: placement === 'full' ? '100%' : 360, padding: placement === 'full' ? '9% 10%' : '38px 34px', color: '#18181b', background: palette.surface, border: `2px solid ${palette.foreground}22`, boxShadow: `12px 12px 0 ${palette.line}55`, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: `${p * 100}%`, height: 12, background: palette.line}}/>
    <div style={{...rise(p)}}><Kicker color={palette.line}>{kicker ?? 'EDITORIAL NOTE'}</Kicker><h2 style={{maxWidth: placement === 'full' ? '72%' : '100%', margin: '28px 0 0', fontFamily: 'Georgia, "Noto Serif SC", serif', fontSize: placement === 'full' ? 92 : 58, lineHeight: 1.02, letterSpacing: '-.05em'}}>{text}</h2></div>
    <div style={{position: 'absolute', right: placement === 'full' ? '9%' : 28, bottom: placement === 'full' ? '13%' : 30, padding: '14px 18px', border: `6px solid ${palette.accent}`, color: palette.accent, fontSize: placement === 'full' ? 34 : 22, lineHeight: 1, fontWeight: 950, transform: `scale(${.6 + p * .4}) rotate(-7deg)`, opacity: p}}>CONFIRMED</div>
  </section>;
};

export const CompletionFamily = ({text, kicker, progress, palette, placement}: StructureProps): ReactElement => {
  const p = clamp(progress);
  return <section data-visual-family="completion" style={{...type, position: 'relative', width: placement === 'full' ? '100%' : 500, minHeight: placement === 'full' ? '100%' : 350, padding: placement === 'full' ? '9% 9%' : '32px 0', color: palette.foreground, background: placement === 'full' ? palette.canvas : 'transparent'}}>
    <Kicker color={palette.line}>{kicker ?? 'FINAL CHECK'}</Kicker>
    <h2 style={{maxWidth: placement === 'full' ? '68%' : '100%', margin: '24px 0 34px', fontSize: placement === 'full' ? 82 : 56, lineHeight: 1, letterSpacing: '-.05em', fontWeight: 950}}>{text}</h2>
    {[.32,.57,.82].map((threshold, index) => <div key={threshold} style={{display: 'grid', gridTemplateColumns: '42px 1fr 62px', alignItems: 'center', gap: 14, marginTop: 16, fontWeight: 900}}><span style={{color: palette.line}}>0{index + 1}</span><i style={{height: 10, overflow: 'hidden', background: `${palette.muted}33`}}><b style={{display: 'block', width: '100%', height: '100%', background: `linear-gradient(90deg,${palette.accent},${palette.line})`, transformOrigin: 'left', transform: `scaleX(${Math.min(1, p / threshold)})`}}/></i><strong style={{color: p >= threshold ? palette.accent : palette.muted}}>{p >= threshold ? 'DONE' : 'WAIT'}</strong></div>)}
  </section>;
};

export const SupportingFamily = ({text, kicker, progress, palette, placement}: StructureProps): ReactElement => {
  const p = clamp(progress);
  return <section data-visual-family="supporting" style={{...type, position: 'relative', width: placement === 'full' ? '100%' : 500, minHeight: placement === 'full' ? '100%' : 340, padding: placement === 'full' ? '9% 8%' : '34px 30px', color: palette.foreground, background: placement === 'full' ? `${palette.canvas}ee` : `${palette.surface}dd`, borderLeft: `10px solid ${palette.accent}`, overflow: 'hidden'}}>
    <Kicker color={palette.line}>{kicker ?? 'EXPLAINER'}</Kicker>
    <h2 style={{maxWidth: placement === 'full' ? '70%' : '100%', margin: '26px 0 0', fontSize: placement === 'full' ? 78 : 54, lineHeight: 1.02, letterSpacing: '-.05em', fontWeight: 950, ...rise(p)}}>{text}</h2>
    <div style={{position: 'absolute', right: '5%', bottom: '9%', display: 'grid', gridTemplateColumns: 'repeat(2,80px)', gap: 12}}>{[0,1,2,3].map((index) => <i key={index} style={{height: 54, borderRadius: 10, background: index / 4 < p ? palette.accent : palette.card, opacity: .34 + p * .66}}/>)}</div>
  </section>;
};
