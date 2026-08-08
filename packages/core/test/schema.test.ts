import {describe, expect, it} from 'vitest';
import {
  DIRECTOR_ROLES,
  ILLUSTRATION_SCENARIOS,
  MOTION_PRIMITIVES,
  PALETTE_IDS,
  StoryboardSchema,
  VISUAL_STRUCTURES,
} from '../src/schema';

const valid = {
  version: '1.0',
  id: 'fixture',
  title: 'Fixture',
  duration: 8,
  fps: 30,
  width: 1920,
  height: 1080,
  captionsMode: 'burned-in',
  source: {video: 'input.mp4', srt: 'input.srt'},
  theme: {background: '#07111f', foreground: '#f6f8fb', accent: '#5eead4'},
  beats: [
    {
      id: 'b1',
      start: 0,
      end: 2.6,
      text: '为什么视频一直没人看？',
      structure: 'impact-question',
      motions: ['hit', 'focus'],
      placement: 'full',
      palette: 'deep-ocean',
      directorRole: 'hook',
    },
    {
      id: 'b2',
      start: 2.8,
      end: 5.8,
      text: '先把信息讲清楚',
      structure: 'adaptive-steps',
      motions: ['slide', 'reveal'],
      placement: 'right',
      palette: 'teal-signal',
      directorRole: 'steps',
      illustration: {type: 'route-activation', label: '内容路径'},
    },
  ],
};

describe('StoryboardSchema', () => {
  it('declares the approved public vocabulary', () => {
    expect(VISUAL_STRUCTURES).toHaveLength(18);
    expect(new Set(VISUAL_STRUCTURES).size).toBe(18);
    expect(MOTION_PRIMITIVES).toHaveLength(10);
    expect(new Set(MOTION_PRIMITIVES).size).toBe(10);
    expect(ILLUSTRATION_SCENARIOS).toHaveLength(6);
    expect(new Set(ILLUSTRATION_SCENARIOS).size).toBe(6);
    expect(PALETTE_IDS).toHaveLength(6);
    expect(new Set(PALETTE_IDS).size).toBe(6);
    expect(DIRECTOR_ROLES).toContain('hook');
    expect(DIRECTOR_ROLES).toContain('evidence');
  });

  it('accepts a valid deterministic storyboard', () => {
    expect(StoryboardSchema.parse(valid).beats).toHaveLength(2);
  });

  it('rejects non-positive and over-six-second beats', () => {
    const nonPositive = structuredClone(valid);
    nonPositive.beats[0].end = 0;
    expect(() => StoryboardSchema.parse(nonPositive)).toThrow(/positive/i);

    const tooLong = structuredClone(valid);
    tooLong.beats[0].end = 6.01;
    expect(() => StoryboardSchema.parse(tooLong)).toThrow(/six seconds/i);
  });

  it('rejects overlaps and unknown structure names', () => {
    const overlap = structuredClone(valid);
    overlap.beats[1].start = 2;
    expect(() => StoryboardSchema.parse(overlap)).toThrow(/overlap/i);

    const unknown = structuredClone(valid) as any;
    unknown.beats[0].structure = 'private-template';
    expect(() => StoryboardSchema.parse(unknown)).toThrow();
  });

  it('rejects unknown palettes, roles, and opaque center placement in 16:9', () => {
    const unknownPalette = structuredClone(valid) as any;
    unknownPalette.beats[0].palette = 'same-blue-card';
    expect(() => StoryboardSchema.parse(unknownPalette)).toThrow();

    const unknownRole = structuredClone(valid) as any;
    unknownRole.beats[0].directorRole = 'decoration';
    expect(() => StoryboardSchema.parse(unknownRole)).toThrow();

    const center = structuredClone(valid) as any;
    center.beats[1].placement = 'center';
    expect(() => StoryboardSchema.parse(center)).toThrow(/center-presenter|center placement/i);
  });
});
