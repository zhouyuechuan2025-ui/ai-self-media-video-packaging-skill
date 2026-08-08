import {describe, expect, it} from 'vitest';
import type {Storyboard} from '../src/schema';
import {assertDirectorPlan, validateDirectorPlan} from '../src/director-validation';

const makeBeat = (index: number, overrides: Record<string, unknown> = {}) => ({
  id: `b${index}`,
  start: (index - 1) * 2.5,
  end: index * 2.5,
  text: `第${index}个真实信息点`,
  structure: ['impact-question', 'gradient-keyword', 'signal-route', 'contrarian-stamp', 'completion-rail'][index % 5],
  motions: ['lift'],
  placement: index === 1 ? 'full' : index % 2 ? 'left' : 'right',
  palette: ['deep-ocean', 'violet-sunset', 'teal-signal', 'editorial-cream', 'acid-action'][index % 5],
  directorRole: index === 1 ? 'hook' : 'definition',
  ...overrides,
});

const storyboard = (beats: unknown[]): Storyboard => ({
  version: '1.0',
  id: 'director-fixture',
  title: 'Director fixture',
  duration: 35,
  fps: 30,
  width: 1920,
  height: 1080,
  captionsMode: 'burned-in',
  source: {video: 'input.mp4', srt: 'input.srt'},
  theme: {background: '#07111f', foreground: '#f6f8fb', accent: '#5eead4'},
  beats,
} as Storyboard);

describe('validateDirectorPlan', () => {
  it('accepts a diverse center-presenter sequence', () => {
    const beats = Array.from({length: 10}, (_, index) => makeBeat(index + 1));
    expect(validateDirectorPlan(storyboard(beats))).toEqual([]);
  });

  it('rejects repeated pairs, excessive templates, repeated side lanes, and invalid full-screen roles', () => {
    const beats = Array.from({length: 10}, (_, index) => makeBeat(index + 1));
    beats[2] = {...beats[1], id: 'pair-repeat', start: 5, end: 7.5};
    beats[3] = makeBeat(4, {structure: 'gradient-keyword'});
    beats[4] = makeBeat(5, {structure: 'gradient-keyword'});
    beats[5] = makeBeat(6, {structure: 'gradient-keyword'});
    beats[6] = makeBeat(7, {placement: 'left'});
    beats[7] = makeBeat(8, {placement: 'left'});
    beats[8] = makeBeat(9, {placement: 'full', directorRole: 'definition'});

    const codes = validateDirectorPlan(storyboard(beats)).map((issue) => issue.code);
    expect(codes).toContain('adjacent-pair-repeat');
    expect(codes).toContain('template-overuse');
    expect(codes).toContain('side-repeat');
    expect(codes).toContain('invalid-full-screen-role');
    expect(() => assertDirectorPlan(storyboard(beats))).toThrow(/Director plan rejected/);
  });
});
