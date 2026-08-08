import {describe, expect, it} from 'vitest';
import {TemplateContentSchema} from '../src/template-contracts';
import {buildTemplateContent} from '../src/content-builders';
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

  it.each([
    ['需要的朋友在评论区打资料包直接就可以拿去用', 'command-palette'],
    ['这套Skill包括了视频剪辑和封面制作', 'editorial-dual-rail'],
    ['是我踩了无数的坑', 'semantic-doodle'],
    ['迭代了几个月才打磨出来的', 'metric-odometer'],
    ['以前剪一条视频，你需要找素材', 'before-after-scrub'],
    ['上字幕卡点弄特效', 'four-stage-pipeline'],
    ['我只需要把视频丢进去5分钟就剪完了', 'signal-route'],
    ['决定能不能爆的还有选题和文案', 'editorial-dual-rail'],
  ] as const)('directs the real-call phrase %s to %s', (text, structure) => {
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

  it('merges a sub-second spoken bridge into the following visual beat', () => {
    const storyboard = planStoryboard({
      id: 'short-bridge',
      title: 'Short bridge',
      cues: [
        {index: 1, start: 0, end: .55, text: '当然'},
        {index: 2, start: .55, end: 2.8, text: '一条好视频只靠剪辑肯定不够'},
      ],
      probe: {...probe, duration: 2.8},
      captionsMode: 'burned-in',
      sourceVideo: 'input.mp4',
      sourceSrt: 'input.srt',
    });
    expect(storyboard.beats).toHaveLength(1);
    expect(storyboard.beats[0]).toMatchObject({start: 0, end: 2.8, structure: 'thesis-and-proof'});
    expect(storyboard.beats[0].text).toContain('当然');
    expect(storyboard.beats[0].text).toContain('只靠剪辑');
  });

  it('splits a long metric cue into two readable visual states', () => {
    const storyboard = planStoryboard({
      id: 'long-metric',
      title: 'Long metric',
      cues: [{index: 1, start: 0, end: 4.4, text: '我一个新账号的视频几乎每条都进入了几万的流量池'}],
      probe: {...probe, duration: 4.4},
      captionsMode: 'burned-in',
      sourceVideo: 'input.mp4',
      sourceSrt: 'input.srt',
    });
    expect(storyboard.beats).toHaveLength(2);
    expect(storyboard.beats[1].structure).toBe('metric-odometer');
    expect(Math.max(...storyboard.beats.map((beat) => beat.end - beat.start))).toBeLessThanOrEqual(3.2);
  });
});

describe('real-call content contracts', () => {
  it('builds a real two-capability rail instead of splitting the wrapper phrase', () => {
    expect(buildTemplateContent('editorial-dual-rail', '这套Skill包括了视频剪辑和封面制作')).toMatchObject({
      leftItems: [{label: '视频剪辑'}],
      rightItems: [{label: '封面制作'}],
    });
  });

  it('turns the five-minute claim into an attributed route', () => {
    expect(buildTemplateContent('signal-route', '我只需要把视频丢进去5分钟就剪完了')).toMatchObject({
      nodes: ['放入原视频', '工作流处理', '约5分钟完成'],
      result: '个人实测：约5分钟',
    });
  });

  it('does not amplify the spoken breakout-probability claim', () => {
    expect(buildTemplateContent('thesis-and-proof', '好出爆款的概率直接拉满')).toEqual({
      structure: 'thesis-and-proof',
      thesis: '剪辑提升内容完成度',
      reason: '爆款仍取决于选题、文案与平台反馈',
    });
  });

  it('attributes the spoken Plus usage metric to the owner case', () => {
    expect(buildTemplateContent('metric-odometer', '一条只消耗我Plus周额度的3%')).toMatchObject({
      metrics: [{value: '3', unit: '%', evidenceStatus: 'owner-confirmed'}],
    });
  });

  it('turns the split next-episode promise into concrete visual content', () => {
    expect(buildTemplateContent('editorial-dual-rail', '下一期我会分享自己的爆款选题方法')).toMatchObject({
      kicker: 'NEXT EPISODE',
      leftItems: [{label: '方法'}],
      rightItems: [{label: '实操'}],
    });
    expect(buildTemplateContent('command-palette', '继续分享：还有核心Skill分享给大家')).toMatchObject({
      commandTitle: '下一期继续分享',
      actions: ['爆款选题方法', '核心Skill实操'],
    });
  });
});
