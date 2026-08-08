import {describe, expect, it} from 'vitest';
import {
  DIRECTOR_ROLES,
  ILLUSTRATION_SCENARIOS,
  MOTION_PRIMITIVES,
  PALETTE_IDS,
  StoryboardSchema,
  VISUAL_STRUCTURES,
} from '../src/schema';
import {SEMANTIC_STRUCTURES, TemplateContentSchema} from '../src/template-contracts';

const valid = {
  version: '2.0',
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
      structure: 'thesis-and-proof',
      content: {
        structure: 'thesis-and-proof',
        thesis: '为什么视频一直没人看？',
        reason: '先找到真正卡点',
      },
      motions: ['hit', 'focus'],
      placement: 'full',
      palette: 'deep-ocean',
      directorRole: 'hook',
    },
    {
      id: 'b2',
      start: 2.8,
      end: 5.8,
      text: '先读取素材，然后分析，最后确认方案',
      structure: 'four-stage-pipeline',
      content: {
        structure: 'four-stage-pipeline',
        title: '执行流程',
        stages: ['读取素材', '分析内容', '确认方案'],
      },
      motions: ['relay', 'slide'],
      placement: 'right',
      palette: 'teal-signal',
      directorRole: 'steps',
      illustration: {type: 'route-activation', label: '内容路径'},
    },
  ],
};

describe('V2 template contracts', () => {
  it('declares ten unique semantic structures', () => {
    expect(SEMANTIC_STRUCTURES).toEqual([
      'editorial-dual-rail',
      'thesis-and-proof',
      'bidirectional-flow',
      'command-palette',
      'four-stage-pipeline',
      'before-after-scrub',
      'evidence-panel',
      'metric-odometer',
      'signal-route',
      'semantic-doodle',
    ]);
    expect(new Set(SEMANTIC_STRUCTURES).size).toBe(10);
    expect(VISUAL_STRUCTURES).toEqual(SEMANTIC_STRUCTURES);
  });

  it('rejects content that does not satisfy the selected structure', () => {
    expect(() => TemplateContentSchema.parse({
      structure: 'before-after-scrub',
      before: '手工处理',
      criterion: '交付方式',
    })).toThrow();

    expect(() => TemplateContentSchema.parse({
      structure: 'metric-odometer',
      metrics: [{value: '3%', unit: '', label: '本次消耗'}],
    })).toThrow(/evidenceStatus/i);
  });
});

describe('StoryboardSchema', () => {
  it('keeps the approved supporting vocabulary', () => {
    expect(MOTION_PRIMITIVES).toHaveLength(10);
    expect(new Set(MOTION_PRIMITIVES).size).toBe(10);
    expect(ILLUSTRATION_SCENARIOS).toHaveLength(6);
    expect(new Set(ILLUSTRATION_SCENARIOS).size).toBe(6);
    expect(PALETTE_IDS).toHaveLength(6);
    expect(new Set(PALETTE_IDS).size).toBe(6);
    expect(DIRECTOR_ROLES).toContain('hook');
    expect(DIRECTOR_ROLES).toContain('evidence');
  });

  it('accepts a valid deterministic V2 storyboard', () => {
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

  it('rejects overlaps, unknown structures, and mismatched content', () => {
    const overlap = structuredClone(valid);
    overlap.beats[1].start = 2;
    expect(() => StoryboardSchema.parse(overlap)).toThrow(/overlap/i);

    const unknown = structuredClone(valid) as any;
    unknown.beats[0].structure = 'generic-color-card';
    expect(() => StoryboardSchema.parse(unknown)).toThrow();

    const mismatch = structuredClone(valid) as any;
    mismatch.beats[0].content = {
      structure: 'before-after-scrub',
      before: '原方案',
      after: '新方案',
      criterion: '视觉结构',
    };
    expect(() => StoryboardSchema.parse(mismatch)).toThrow(/match/i);
  });

  it('rejects unknown palettes, roles, and center placement', () => {
    const unknownPalette = structuredClone(valid) as any;
    unknownPalette.beats[0].palette = 'same-blue-card';
    expect(() => StoryboardSchema.parse(unknownPalette)).toThrow();

    const unknownRole = structuredClone(valid) as any;
    unknownRole.beats[0].directorRole = 'decoration';
    expect(() => StoryboardSchema.parse(unknownRole)).toThrow();

    const center = structuredClone(valid) as any;
    center.beats[1].placement = 'center';
    expect(() => StoryboardSchema.parse(center)).toThrow();
  });
});
