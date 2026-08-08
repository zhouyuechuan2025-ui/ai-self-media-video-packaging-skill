import {z} from 'zod';

export const SEMANTIC_STRUCTURES = [
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
] as const;

const requiredText = (max: number) => z.string().trim().min(1).max(max);

const editorialItem = z.object({
  label: requiredText(14),
  detail: requiredText(22),
});

const metric = z.object({
  value: requiredText(12),
  unit: z.string().trim().max(8),
  label: requiredText(18),
  evidenceStatus: z.enum(['sourced', 'owner-confirmed', 'estimate']),
  sourceLabel: z.string().trim().max(28).optional(),
});

export const TemplateContentSchema = z.discriminatedUnion('structure', [
  z.object({
    structure: z.literal('editorial-dual-rail'),
    kicker: requiredText(18),
    headline: requiredText(24),
    leftItems: z.array(editorialItem).min(1).max(3),
    rightItems: z.array(editorialItem).min(1).max(3),
    takeaway: requiredText(24),
  }),
  z.object({
    structure: z.literal('thesis-and-proof'),
    thesis: requiredText(24),
    reason: requiredText(36),
    sourceLabel: z.string().trim().max(28).optional(),
    sourceDetail: z.string().trim().max(48).optional(),
  }),
  z.object({
    structure: z.literal('bidirectional-flow'),
    leftLabel: requiredText(14),
    rightLabel: requiredText(14),
    forwardAction: requiredText(18),
    returnAction: z.string().trim().max(18).optional(),
    result: requiredText(24),
  }),
  z.object({
    structure: z.literal('command-palette'),
    commandTitle: requiredText(20),
    actions: z.array(requiredText(22)).min(2).max(5),
    resultState: requiredText(22),
  }),
  z.object({
    structure: z.literal('four-stage-pipeline'),
    title: requiredText(24),
    stages: z.array(requiredText(16)).min(3).max(4),
    output: z.string().trim().max(22).optional(),
  }),
  z.object({
    structure: z.literal('before-after-scrub'),
    before: requiredText(24),
    after: requiredText(24),
    criterion: requiredText(18),
    delta: z.string().trim().max(18).optional(),
  }),
  z.object({
    structure: z.literal('evidence-panel'),
    evidenceAsset: requiredText(120),
    caption: requiredText(28),
    sourceLabel: requiredText(28),
    interpretation: requiredText(36),
  }),
  z.object({
    structure: z.literal('metric-odometer'),
    metrics: z.array(metric).min(1).max(3),
  }),
  z.object({
    structure: z.literal('signal-route'),
    nodes: z.array(requiredText(14)).min(3).max(5),
    routeLabel: requiredText(18),
    failureNode: z.string().trim().max(14).optional(),
    result: requiredText(22),
  }),
  z.object({
    structure: z.literal('semantic-doodle'),
    subject: requiredText(14),
    action: requiredText(18),
    outcome: requiredText(20),
    accent: z.string().regex(/^#[0-9a-f]{6}$/i, 'Expected a six-digit hex color'),
    annotation: z.string().trim().max(22).optional(),
  }),
]);

export type SemanticStructure = (typeof SEMANTIC_STRUCTURES)[number];
export type TemplateContent = z.infer<typeof TemplateContentSchema>;

