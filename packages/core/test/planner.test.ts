import {describe, expect, it} from 'vitest';
import {planStoryboard} from '../src/planner';
import type {MediaProbe, SrtCue} from '../src/types';

const probe: MediaProbe = {
  duration: 14,
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

    first.beats.forEach((beat, index) => {
      expect(beat.end - beat.start).toBeGreaterThan(0);
      expect(beat.end - beat.start).toBeLessThanOrEqual(6);
      if (index > 0) expect(beat.structure).not.toBe(first.beats[index - 1].structure);
    });
  });
});
