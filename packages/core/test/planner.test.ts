import {describe, expect, it} from 'vitest';
import {validateDirectorPlan} from '../src/director-validation';
import {planStoryboard} from '../src/planner';
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
  {index: 3, start: 5.3, end: 8.2, text: '三个步骤把信息路径跑通'},
  {index: 4, start: 8.3, end: 11.2, text: '这是官方截图和数据证据'},
  {index: 5, start: 11.3, end: 14, text: '最后完成检查，评论区见'},
  {index: 6, start: 14.1, end: 17, text: '真正关键不是堆更多特效'},
  {index: 7, start: 17.1, end: 20, text: '以前手工剪辑，现在流程自动跑通'},
  {index: 8, start: 20.1, end: 23, text: '画面左边讲重点，右边展示结果'},
  {index: 9, start: 23.1, end: 26, text: '一条路径连接选题文案和剪辑'},
  {index: 10, start: 26.1, end: 29, text: '5分钟完成是我的本次实测'},
  {index: 11, start: 29.1, end: 32, text: '这里给出来源和官方文档'},
  {index: 12, start: 32.1, end: 36, text: '下一步检查结果并完成交付'},
];

describe('planStoryboard', () => {
  it('creates deterministic, readable, evidence-aware beats', () => {
    const first = planStoryboard({
      id: 'planner-fixture', title: 'Planner fixture', cues, probe,
      captionsMode: 'burned-in', sourceVideo: 'input.mp4', sourceSrt: 'input.srt',
    });
    const second = planStoryboard({
      id: 'planner-fixture', title: 'Planner fixture', cues, probe,
      captionsMode: 'burned-in', sourceVideo: 'input.mp4', sourceSrt: 'input.srt',
    });

    expect(first).toEqual(second);
    expect(first.beats[0].structure).toBe('impact-question');
    expect(first.beats[0].end).toBeLessThanOrEqual(3);
    expect(first.beats.find((beat) => beat.text.includes('证据'))?.structure).toMatch(/^evidence-/);
    expect(first.beats.some((beat) => beat.illustration?.type === 'route-activation')).toBe(true);
    expect(first.captionsMode).toBe('burned-in');
    expect(JSON.stringify(first)).not.toContain('captionTrack');
    expect(new Set(first.beats.map((beat) => beat.palette)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(first.beats.map((beat) => beat.structure)).size).toBeGreaterThanOrEqual(5);
    expect(first.beats.every((beat) => ['left', 'right', 'full'].includes(beat.placement))).toBe(true);

    const fullScreenRoles = first.beats
      .filter((beat) => beat.placement === 'full')
      .map((beat) => beat.directorRole);
    expect(fullScreenRoles.every((role) => ['hook', 'bridge', 'payoff', 'cta', 'evidence'].includes(role))).toBe(true);

    first.beats.forEach((beat, index) => {
      expect(beat.end - beat.start).toBeGreaterThan(0);
      expect(beat.end - beat.start).toBeLessThanOrEqual(6);
      if (index > 0) expect(beat.structure).not.toBe(first.beats[index - 1].structure);
      if (index > 0) {
        const previous = first.beats[index - 1];
        expect(`${beat.structure}:${beat.palette}`).not.toBe(`${previous.structure}:${previous.palette}`);
        if (beat.placement !== 'full' && previous.placement !== 'full') {
          expect(beat.placement).not.toBe(previous.placement);
        }
      }
    });
  });

  it('rotates structures for a long repetitive talking-head script', () => {
    const repetitiveCues = Array.from({length: 21}, (_, index) => ({
      index: index + 1,
      start: index * 2,
      end: index * 2 + 1.8,
      text: `这是第${index + 1}个普通观点，需要用不同的视觉语法解释`,
    }));
    const longProbe = {...probe, duration: 44};
    const storyboard = planStoryboard({
      id: 'rotation-fixture', title: 'Rotation fixture', cues: repetitiveCues, probe: longProbe,
      captionsMode: 'burned-in', sourceVideo: 'input.mp4', sourceSrt: 'input.srt',
    });

    expect(validateDirectorPlan(storyboard)).toEqual([]);
    const counts = new Map<string, number>();
    storyboard.beats.forEach((beat) => counts.set(beat.structure, (counts.get(beat.structure) ?? 0) + 1));
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(3);
  });
});
