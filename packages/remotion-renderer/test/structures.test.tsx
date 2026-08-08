import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {PALETTES} from '../../core/src/palettes';
import {SEMANTIC_STRUCTURES, type SemanticStructure, type TemplateContent} from '../../core/src/template-contracts';
import {contrastRatio} from '../src/contrast';
import {FullScreenSurface, SideSurface} from '../src/structures/shared';
import {structureRegistry} from '../src/structures';
import {MetricOdometer} from '../src/structures/v2/MetricOdometer';
import {SignalRoute} from '../src/structures/v2/SignalRoute';
import {ThesisAndProof} from '../src/structures/v2/ThesisAndProof';
import {BeforeAfterScrub} from '../src/structures/v2/BeforeAfterScrub';
import {presenterSafeZones, sideLaneStyle} from '../src/theme';

const fixtureContent: Record<SemanticStructure, TemplateContent> = {
  'editorial-dual-rail': {structure: 'editorial-dual-rail', kicker: '核心信息', headline: '结构服务内容', leftItems: [{label: '现状', detail: '重复卡片难理解'}], rightItems: [{label: '行动', detail: '按语义选择结构'}], takeaway: '先讲清楚，再做漂亮'},
  'thesis-and-proof': {structure: 'thesis-and-proof', thesis: '不是换颜色', reason: '而是更换信息结构', sourceLabel: '设计原则'},
  'bidirectional-flow': {structure: 'bidirectional-flow', leftLabel: '脚本', rightLabel: '视频', forwardAction: '生成', returnAction: '反馈修正', result: '形成闭环'},
  'command-palette': {structure: 'command-palette', commandTitle: '执行清单', actions: ['读取字幕', '生成方案', '等待确认'], resultState: 'READY'},
  'four-stage-pipeline': {structure: 'four-stage-pipeline', title: '包装流程', stages: ['分析', '设计', '验收', '导出'], output: '可复现成片'},
  'before-after-scrub': {structure: 'before-after-scrub', before: '统一文字卡', after: '语义化结构', criterion: '视觉表达'},
  'evidence-panel': {structure: 'evidence-panel', evidenceAsset: 'evidence/doc.png', caption: '官方文档', sourceLabel: '一手来源', interpretation: '证据优先于装饰'},
  'metric-odometer': {structure: 'metric-odometer', metrics: [{value: '10', unit: '类', label: '独立结构', evidenceStatus: 'sourced', sourceLabel: 'V2合同'}]},
  'signal-route': {structure: 'signal-route', nodes: ['字幕', '语义', '模板', '成片'], routeLabel: '信息路径', result: '结构与内容一致'},
  'semantic-doodle': {structure: 'semantic-doodle', subject: '创作者', action: '推动流程', outcome: '完成交付', accent: '#e97a5f'},
};

const renderStructure = (structure: SemanticStructure): string => {
  const entry = structureRegistry[structure];
  return renderToStaticMarkup(
    <entry.Component
      content={fixtureContent[structure]}
      progress={0.72}
      palette={PALETTES[structure === 'semantic-doodle' ? 'paper-sketch' : 'deep-ocean']}
      placement={entry.safeZone === 'full' ? 'full' : 'left'}
      {...(structure === 'evidence-panel' ? {evidence: {src: 'evidence/doc.png', label: '官方文档'}} : {})}
    />,
  );
};

describe('V2 structureRegistry', () => {
  it('registers ten independent component functions', () => {
    expect(Object.keys(structureRegistry).sort()).toEqual([...SEMANTIC_STRUCTURES].sort());
    expect(new Set(Object.values(structureRegistry).map((entry) => entry.Component)).size).toBe(10);
    expect(Object.values(structureRegistry).every((entry) => ['presenter-safe', 'opaque-full-screen', 'adaptive'].includes(entry.presentationMode))).toBe(true);
  });

  it('renders a distinct semantic identity for every structure', () => {
    for (const structure of SEMANTIC_STRUCTURES) {
      const markup = renderStructure(structure);
      expect(markup).toContain(`data-structure-identity="${structure}"`);
      expect(markup).toContain('data-critical-content="true"');
      expect(markup.length).toBeGreaterThan(280);
    }
  });

  it('does not expose any old family identity', () => {
    const markup = SEMANTIC_STRUCTURES.map(renderStructure).join('\n');
    expect(markup).not.toMatch(/data-visual-family=/);
  });
});
describe('presenter-safe visual foundations', () => {
  it('keeps critical side content outside the center and subtitle reserves', () => {
    expect(presenterSafeZones).toEqual({
      center: {startPercent: 35, endPercent: 65},
      left: {startPercent: 5, endPercent: 32},
      right: {startPercent: 68, endPercent: 95},
      subtitleBottomPercent: 18,
    });
    expect(sideLaneStyle('left')).toMatchObject({left: '5%', width: '27%'});
    expect(sideLaneStyle('right')).toMatchObject({right: '5%', width: '27%'});
    expect(sideLaneStyle('left')).not.toHaveProperty('bottom');
  });

  it('keeps normal and large text at WCAG AA contrast', () => {
    expect(contrastRatio('#f6f2e8', '#0b1325')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#55d7ff', '#0b1325')).toBeGreaterThanOrEqual(3);
  });

  it('marks a full-screen presenter window and subtitle reserve', () => {
    const html = renderToStaticMarkup(
      <FullScreenSurface mode="presenter-window" palette={PALETTES['deep-ocean']}>
        <span>结论</span>
      </FullScreenSurface>,
    );
    expect(html).toContain('data-presenter-window="35-65"');
    expect(html).toContain('data-subtitle-reserve="18"');
    expect(html).not.toContain('border-right');
    expect(html).not.toContain('border-left');
  });

  it('makes presenter-safe cards fit their content instead of filling the lane height', () => {
    const html = renderToStaticMarkup(
      <SideSurface side="left" palette={PALETTES['deep-ocean']}>
        <span>紧凑信息</span>
      </SideSurface>,
    );
    expect(html).toContain('data-density-mode="content-fit"');
    expect(html).toContain('data-overlay-zone="left"');
    expect(html).not.toContain('bottom:18%');
    expect(html).not.toContain('height:75%');
  });

  it('uses only opaque full-screen or presenter-safe modes, never a translucent hybrid', () => {
    const opaque = renderToStaticMarkup(
      <FullScreenSurface mode="opaque" palette={PALETTES['deep-ocean']}>
        <span>全屏结论</span>
      </FullScreenSurface>,
    );
    expect(opaque).toContain('data-full-screen-opaque="true"');
    expect(opaque).not.toContain('data-presenter-window');
    expect(opaque).not.toContain('transparent');

    const fullHook = renderToStaticMarkup(
      <ThesisAndProof content={fixtureContent['thesis-and-proof']} progress={0.72} palette={PALETTES['deep-ocean']} placement="full"/>,
    );
    expect(fullHook).toContain('data-full-screen-opaque="true"');

    for (const structure of ['bidirectional-flow', 'four-stage-pipeline', 'before-after-scrub', 'evidence-panel', 'signal-route', 'semantic-doodle'] as const) {
      const markup = renderStructure(structure);
      expect(markup).toContain('data-full-screen-opaque="true"');
      expect(markup).not.toContain('data-presenter-window');
    }
  });

  it('renders verbal metrics literally instead of animating them from zero', () => {
    const html = renderToStaticMarkup(
      <MetricOdometer
        content={{structure: 'metric-odometer', metrics: [{value: '几万', unit: '', label: '个人案例', evidenceStatus: 'owner-confirmed'}]}}
        progress={0.5}
        palette={PALETTES['teal-signal']}
        placement="full"
      />,
    );
    expect(html).toContain('data-verbal-metric="true"');
    expect(html).toContain('>几万<');
    expect(html).not.toContain('>0<');
  });

  it('settles before-after review frames with both labels fully readable', () => {
    const html = renderToStaticMarkup(
      <BeforeAfterScrub
        content={{structure: 'before-after-scrub', before: '人工逐项找素材', after: '原视频进入工作流', criterion: '剪辑入口'}}
        progress={0.72}
        palette={PALETTES['editorial-cream']}
        placement="full"
      />,
    );
    expect(html).toContain('left:52%');
    expect(html).toContain('text-align:right');
  });

  it('makes signal-route fully opaque because its geometry crosses the center', () => {
    const html = renderToStaticMarkup(
      <SignalRoute
        content={{structure: 'signal-route', nodes: ['放入原视频', '工作流处理', '约5分钟完成'], routeLabel: '本次个人工作流', result: '个人实测：约5分钟'}}
        progress={0.72}
        palette={PALETTES['acid-action']}
        placement="full"
      />,
    );
    expect(html).toContain('data-route-layout="full-canvas"');
    expect(html).toContain('data-full-screen-opaque="true"');
    expect(html).not.toContain('data-presenter-window');
  });
});
