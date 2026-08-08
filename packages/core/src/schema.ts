import {z} from 'zod';
import {PALETTE_IDS} from './palettes';

export {PALETTE_IDS} from './palettes';

export const DIRECTOR_ROLES = [
  'hook', 'definition', 'problem', 'contrast', 'mechanism', 'steps',
  'data', 'evidence', 'payoff', 'cta', 'bridge',
] as const;

export const VISUAL_STRUCTURES = [
  'impact-question',
  'contrarian-stamp',
  'gradient-keyword',
  'split-conflict',
  'three-beat-hook',
  'side-insight-card',
  'dual-concept',
  'keyword-relay',
  'adaptive-steps',
  'signal-route',
  'state-switch',
  'chapter-timeline',
  'evidence-pip',
  'evidence-takeover',
  'metric-counter',
  'before-after',
  'capability-matrix',
  'completion-rail',
] as const;

export const MOTION_PRIMITIVES = [
  'hit',
  'slide',
  'lift',
  'stamp',
  'route',
  'trace',
  'count',
  'reveal',
  'relay',
  'focus',
] as const;

export const ILLUSTRATION_SCENARIOS = [
  'information-overload',
  'climb-boulder',
  'workstation-balance',
  'paper-plane-route',
  'route-activation',
  'before-after-illustration',
] as const;

const color = z.string().regex(/^#[0-9a-f]{6}$/i, 'Expected a six-digit hex color');

const beatSchema = z.object({
  id: z.string().min(1),
  start: z.number().min(0),
  end: z.number().positive(),
  text: z.string().min(1).max(80),
  structure: z.enum(VISUAL_STRUCTURES),
  motions: z.array(z.enum(MOTION_PRIMITIVES)).min(1).max(3),
  placement: z.enum(['left', 'right', 'center', 'full']),
  palette: z.enum(PALETTE_IDS),
  directorRole: z.enum(DIRECTOR_ROLES),
  kicker: z.string().max(28).optional(),
  evidence: z
    .object({src: z.string().min(1), label: z.string().min(1), sourceUrl: z.string().url().optional()})
    .optional(),
  illustration: z
    .object({type: z.enum(ILLUSTRATION_SCENARIOS), label: z.string().min(1).max(32)})
    .optional(),
});

export const StoryboardSchema = z
  .object({
    version: z.literal('1.0'),
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    duration: z.number().positive(),
    fps: z.number().int().min(15).max(60),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    captionsMode: z.enum(['burned-in', 'none', 'generated']),
    source: z.object({video: z.string().min(1), srt: z.string().optional()}),
    theme: z.object({background: color, foreground: color, accent: color}),
    beats: z.array(beatSchema).min(1),
  })
  .superRefine((storyboard, context) => {
    storyboard.beats.forEach((beat, index) => {
      const duration = beat.end - beat.start;
      if (duration <= 0) {
        context.addIssue({
          code: 'custom',
          path: ['beats', index, 'end'],
          message: 'Beat duration must be positive',
        });
      }
      if (duration > 6) {
        context.addIssue({
          code: 'custom',
          path: ['beats', index, 'end'],
          message: 'Beat duration cannot exceed six seconds',
        });
      }
      if (beat.end > storyboard.duration + 0.001) {
        context.addIssue({
          code: 'custom',
          path: ['beats', index, 'end'],
          message: 'Beat exceeds source duration',
        });
      }
      if (storyboard.width / storyboard.height > 1.5 && beat.placement === 'center') {
        context.addIssue({
          code: 'custom',
          path: ['beats', index, 'placement'],
          message: 'Center placement is not allowed for a center-presenter 16:9 source',
        });
      }
      const previous = storyboard.beats[index - 1];
      if (previous && beat.start < previous.end) {
        context.addIssue({
          code: 'custom',
          path: ['beats', index, 'start'],
          message: 'Beats cannot overlap or be out of order',
        });
      }
    });
  });

export type Storyboard = z.infer<typeof StoryboardSchema>;
export type StoryboardBeat = Storyboard['beats'][number];
export type VisualStructure = (typeof VISUAL_STRUCTURES)[number];
export type MotionPrimitive = (typeof MOTION_PRIMITIVES)[number];
export type IllustrationScenario = (typeof ILLUSTRATION_SCENARIOS)[number];
export type DirectorRole = (typeof DIRECTOR_ROLES)[number];
