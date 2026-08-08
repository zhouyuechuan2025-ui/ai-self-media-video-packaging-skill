import {describe, expect, it} from 'vitest';
import {TemplateContentSchema} from '../src/template-contracts';
import {validateDirectorPlan} from '../src/director-validation';
import {planStoryboard} from '../src/planner';
import {classifySemanticStructure} from '../src/semantic-rules';
import type {MediaProbe, SrtCue} from '../src/types';

const probe: MediaProbe = {
  duration: 36,
  size: 1000,
  video: {codec: 'h264', width: 1920, height: 1080, fps: 30},
  audio: {codec: 'aac', sampleRate: 48000, channels: 2},
};

const cues: SrtCue[] = [
  {index: 1, start: 0, end: 2.6, text: '为什么你的视频一直没人看？'},
  {index: 2, start: 2.7, end: 5.2, text: '不是内容不够多，而是重点不清楚'},
  {index: 3, start: 5.3, end: 8.2, text: '首先读取素材，然后分析，再生成方案，最后确认'},
  {index: 4, start: 8.3, end: 11.2, text: '这是官方截图和文档证据'},
  {index: 5, start: 11.3, end: 14, text: '运行检查、审核方案、确认导出'},
  {index: 6, start: 14.1, end: 17, text: '输入脚本，AI生成视频，人再反馈修正'},
  {index: 7, start: 17.1, end: 20, text: '节点从选题流向脚本再到视频'},
  {index: 8, start: 20.1, end: 23, text: '本次只消耗了3%的额度'},
  {index: 9, start: 23.1, end: 26, text: '创作者推着任务越过难点拿到结果'},
  {index: 10, start: 26.1, end: 29, text: '左边说明现状，右边给出行动'},
  {index: 11, start: 29.1, end: 32, text: '关键是让结构服务于内容，因为读者先理解逻辑'},
  {index: 12, start: 32.1, end: 36, text: '下一步检查结果并完成交付'},
];

describe('semantic classification', () => {
  it.each([
    ['首先读取素材，然后分析，再生成方案，最后执行', 'four-stage-pipeline'],
    ['从手工剪辑变成自动化工作流', 'before-after-scrub'],
    ['输入脚本，AI生成视频，人再反馈修正', 'bidirectional-flow'],
    ['运行检查、审核方案、确认导出', 'command-palette'],
    ['节点从选题流向脚本再到视频', 'signal-route'],
    ['本次只消耗了3%', 'metric-odometer'],
    ['创作者推着任务越过难点拿到结果', 'semantic-doodle'],
  ] as const)('maps %s to %s', (text, structure) => {
    expect(classifySemanticStructure(text, 1)).toBe(structure);
  });
});

describe('planStoryboard', () => {
  it('creates deterministic beats with valid semantic content', () => {
    const input = {
      id: 'planner-fixture',
      title: 'Planner fixture',
      cues,
      probe,
      captionsMode: 'burned-in' as const,
      sourceVideo: 'input.mp4',
      sourceSrt: 'input.srt',
      evidenceByCue: {
        4: {src: 'evidence/official-doc.png', label: '官方文档', sourceUrl: 'https://example.com/docs'},
      },
    };
    const first = planStoryboard(input);
    const second = planStoryboard(input);

    expect(first).toEqual(second);
    expect(first.version).toBe('2.0');
    expect(first.beats[0].structure).toBe('thesis-and-proof');
    expect(first.beats.find((beat) => beat.text.includes('证据'))?.structure).toBe('evidence-panel');
    expect(first.beats.some((beat) => beat.illustration?.type === 'climb-boulder')).toBe(true);
    expect(first.captionsMode).toBe('burned-in');
    expect(JSON.stringify(first)).not.toContain('captionTrack');
    expect(new Set(first.beats.map((beat) => beat.structure)).size).toBeGreaterThanOrEqual(8);
    expect(first.beats.every((beat) => ['left', 'right', 'full'].includes(beat.placement))).toBe(true);

    first.beats.forEach((beat, index) => {
      expect(beat.content.structure).toBe(beat.structure);
      expect(() => TemplateContentSchema.parse(beat.content)).not.toThrow();
      expect(beat.end - beat.start).toBeGreaterThan(0);
      expect(beat.end - beat.start).toBeLessThanOrEqual(6);
      const previous = first.beats[index - 1];
      if (previous && beat.placement !== 'full' && previous.placement !== 'full') {
        expect(beat.placement).not.toBe(previous.placement);
      }
    });
    expect(validateDirectorPlan(first)).toEqual([]);
  });

  it('does not force unrelated structures into repetitive generic copy', () => {
    const repetitiveCues = Array.from({length: 12}, (_, index) => ({
      index: index + 1,
      start: index * 2,
      end: index * 2 + 1.8,
      text: '这是一个普通观点，需要把信息讲清楚',
    }));
    const storyboard = planStoryboard({
      id: 'repetitive-fixture',
      title: 'Repetitive fixture',
      cues: repetitiveCues,
      probe: {...probe, duration: 24},
      captionsMode: 'burned-in',
      sourceVideo: 'input.mp4',
      sourceSrt: 'input.srt',
    });

    expect(new Set(storyboard.beats.map((beat) => beat.structure)).size).toBeLessThanOrEqual(2);
    expect(storyboard.beats.every((beat) => ['editorial-dual-rail', 'thesis-and-proof'].includes(beat.structure))).toBe(true);
  });

  it('downgrades an evidence mention when no source asset is available', () => {
    const storyboard = planStoryboard({
      id: 'evidence-downgrade',
      title: 'Evidence downgrade',
      cues: [{index: 1, start: 0, end: 2.4, text: '这里引用官方文档作为证据'}],
      probe: {...probe, duration: 2.4},
      captionsMode: 'burned-in',
      sourceVideo: 'input.mp4',
      sourceSrt: 'input.srt',
    });

    expect(storyboard.beats[0].structure).toBe('thesis-and-proof');
    expect(storyboard.beats[0].evidence).toBeUndefined();
  });
});
