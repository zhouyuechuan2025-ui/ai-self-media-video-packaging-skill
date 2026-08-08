import {describe, expect, it} from 'vitest';
import type {Storyboard, StoryboardBeat} from '../src/schema';
import type {SemanticStructure, TemplateContent} from '../src/template-contracts';
import {assertDirectorPlan, validateDirectorPlan} from '../src/director-validation';

const contentFor = (structure: SemanticStructure): TemplateContent => {
  if (structure === 'editorial-dual-rail') return {structure, kicker: '重点', headline: '结构服务内容', leftItems: [{label: '左侧', detail: '解释现状'}], rightItems: [{label: '右侧', detail: '给出行动'}], takeaway: '先讲清楚'};
  if (structure === 'thesis-and-proof') return {structure, thesis: '核心观点', reason: '用事实支撑'};
  if (structure === 'bidirectional-flow') return {structure, leftLabel: '输入', rightLabel: '输出', forwardAction: '生成', returnAction: '反馈', result: '持续修正'};
  if (structure === 'command-palette') return {structure, commandTitle: '执行清单', actions: ['运行检查', '确认结果'], resultState: '完成'};
  if (structure === 'four-stage-pipeline') return {structure, title: '执行流程', stages: ['读取', '分析', '生成', '确认']};
  if (structure === 'before-after-scrub') return {structure, before: '手工处理', after: '自动流程', criterion: '工作方式'};
  if (structure === 'evidence-panel') return {structure, evidenceAsset: 'evidence/doc.png', caption: '官方文档', sourceLabel: '官方来源', interpretation: '支持当前结论'};
  if (structure === 'metric-odometer') return {structure, metrics: [{value: '3', unit: '%', label: '本次消耗', evidenceStatus: 'owner-confirmed'}]};
  if (structure === 'signal-route') return {structure, nodes: ['选题', '脚本', '视频'], routeLabel: '信息路径', result: '形成闭环'};
  return {structure, subject: '创作者', action: '推进任务', outcome: '完成交付', accent: '#e97a5f'};
};

const structures: SemanticStructure[] = [
  'thesis-and-proof',
  'editorial-dual-rail',
  'four-stage-pipeline',
  'before-after-scrub',
  'evidence-panel',
  'command-palette',
  'bidirectional-flow',
  'metric-odometer',
  'signal-route',
  'semantic-doodle',
];

const beat = (index: number, overrides: Partial<StoryboardBeat> = {}): StoryboardBeat => {
  const structure = overrides.structure ?? structures[(index - 1) % structures.length];
  const full = ['four-stage-pipeline', 'before-after-scrub', 'evidence-panel', 'metric-odometer', 'signal-route', 'semantic-doodle'].includes(structure);
  return {
    id: `b${index}`,
    start: (index - 1) * 2.5,
    end: index * 2.5,
    text: `第${index}个真实信息点`,
    structure,
    content: contentFor(structure),
    motions: ['lift'],
    placement: full || index === 1 ? 'full' : index % 2 ? 'left' : 'right',
    palette: ['deep-ocean', 'violet-sunset', 'teal-signal', 'editorial-cream', 'acid-action'][index % 5] as StoryboardBeat['palette'],
    directorRole: index === 1 ? 'hook' : structure === 'evidence-panel' ? 'evidence' : structure === 'metric-odometer' ? 'data' : structure === 'four-stage-pipeline' ? 'steps' : structure === 'before-after-scrub' ? 'contrast' : structure === 'signal-route' || structure === 'bidirectional-flow' ? 'mechanism' : 'definition',
    ...(structure === 'evidence-panel' ? {evidence: {src: 'evidence/doc.png', label: '官方文档'}} : {}),
    ...overrides,
  };
};

const storyboard = (beats: StoryboardBeat[], duration = 35): Storyboard => ({
  version: '2.0',
  id: 'director-fixture',
  title: 'Director fixture',
  duration,
  fps: 30,
  width: 1920,
  height: 1080,
  captionsMode: 'burned-in',
  source: {video: 'input.mp4', srt: 'input.srt'},
  theme: {background: '#07111f', foreground: '#f6f8fb', accent: '#5eead4'},
  beats,
});

describe('validateDirectorPlan', () => {
  it('accepts a diverse center-presenter V2 sequence', () => {
    const beats = Array.from({length: 10}, (_, index) => beat(index + 1));
    expect(validateDirectorPlan(storyboard(beats))).toEqual([]);
  });

  it('rejects palette-only variety and a structure run longer than two', () => {
    const beats = Array.from({length: 10}, (_, index) => beat(index + 1));
    beats[1] = beat(2, {structure: 'editorial-dual-rail', content: contentFor('editorial-dual-rail'), placement: 'right'});
    beats[2] = beat(3, {structure: 'editorial-dual-rail', content: contentFor('editorial-dual-rail'), placement: 'left'});
    beats[3] = beat(4, {structure: 'editorial-dual-rail', content: contentFor('editorial-dual-rail'), placement: 'right'});
    beats[4] = beat(5, {structure: 'editorial-dual-rail', content: contentFor('editorial-dual-rail'), placement: 'left'});

    const codes = validateDirectorPlan(storyboard(beats)).map((issue) => issue.code);
    expect(codes).toContain('structure-run-too-long');
    expect(codes).toContain('structure-diversity');
  });

  it('rejects missing evidence, invalid full-screen use, repeated side lanes, and content mismatch', () => {
    const beats = Array.from({length: 10}, (_, index) => beat(index + 1));
    beats[1] = beat(2, {placement: 'left'});
    beats[2] = beat(3, {structure: 'command-palette', content: contentFor('command-palette'), placement: 'left', directorRole: 'definition'});
    beats[4] = beat(5, {structure: 'evidence-panel', content: contentFor('evidence-panel'), evidence: undefined});
    beats[5] = beat(6, {structure: 'command-palette', content: contentFor('thesis-and-proof') as StoryboardBeat['content'], placement: 'full', directorRole: 'definition'});

    const issues = validateDirectorPlan(storyboard(beats));
    const codes = issues.map((issue) => issue.code);
    expect(codes).toEqual(expect.arrayContaining([
      'side-repeat',
      'evidence-missing',
      'invalid-full-screen-role',
      'content-contract',
    ]));
    expect(() => assertDirectorPlan(storyboard(beats))).toThrow(/Director plan rejected/);
  });

  it('does not demand eight structures for a short clip', () => {
    const beats = [beat(1), beat(2)];
    expect(validateDirectorPlan(storyboard(beats, 5)).map((issue) => issue.code)).not.toContain('structure-diversity');
  });
});
