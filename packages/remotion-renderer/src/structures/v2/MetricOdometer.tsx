import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {FullScreenSurface, Kicker, SourceStamp, phase, rise, typography} from '../shared';
import type {StructureProps} from '../types';

const metricStatusLabel = {
  sourced: 'SOURCED',
  'owner-confirmed': 'OWNER CONFIRMED',
  estimate: 'ESTIMATE',
} as const;

const AnimatedValue = ({value, progress}: {value: string; progress: number}): ReactElement => {
  const numericText = value.replace(/[^0-9.-]/g, '');
  const isVerbal = !/[0-9]/.test(value) || numericText === '';
  if (isVerbal) return <span data-verbal-metric="true">{value}</span>;
  const numeric = Number(numericText);
  const display = Number.isFinite(numeric) ? String(Math.round(numeric * phase(progress, 0.08, 0.78))) : value;
  return <span data-verbal-metric="false">{display}</span>;
};

export const MetricOdometer = ({content, progress, palette}: StructureProps): ReactElement => {
  if (content.structure !== 'metric-odometer') throw new Error('MetricOdometer received incompatible content');
  return (
    <AbsoluteFill data-structure-identity="metric-odometer" data-critical-content="true" style={typography}>
      <FullScreenSurface mode="presenter-window" palette={palette}>
        <div style={{position: 'absolute', inset: '7% 5% 11%', display: 'grid', gridTemplateColumns: 'repeat(2, 27%)', justifyContent: 'space-between', gap: '36%'}}>
          {content.metrics.map((metric, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const reveal = phase(progress, 0.08 + index * 0.18, 0.56 + index * 0.18);
            return (
              <article key={`${metric.label}-${index}`} data-metric-side={side} style={{alignSelf: index === 2 ? 'end' : 'center', minHeight: 244, padding: '28px 25px', borderRadius: 28, background: `${palette.surface}ee`, border: `2px solid ${index === 0 ? palette.accent : palette.line}88`, boxShadow: `0 24px 64px ${palette.canvas}99`, ...rise(reveal, 26)}}>
                <Kicker color={index === 0 ? palette.accent : palette.line}>{metricStatusLabel[metric.evidenceStatus]}</Kicker>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 24, color: palette.foreground}}>
                  <span style={{fontSize: 78, lineHeight: .9, fontWeight: 980, letterSpacing: '-0.065em'}}><AnimatedValue value={metric.value} progress={progress}/></span>
                  <span style={{fontSize: 24, fontWeight: 900, color: palette.accent}}>{metric.unit}</span>
                </div>
                <div style={{marginTop: 19, fontSize: 24, lineHeight: 1.2, fontWeight: 850, color: palette.foreground}}>{metric.label}</div>
                {metric.sourceLabel ? <div style={{marginTop: 19}}><SourceStamp label={metric.sourceLabel} palette={palette}/></div> : null}
              </article>
            );
          })}
        </div>
      </FullScreenSurface>
    </AbsoluteFill>
  );
};
