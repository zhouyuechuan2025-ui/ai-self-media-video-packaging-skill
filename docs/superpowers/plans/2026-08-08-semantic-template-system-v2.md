# Semantic Template System V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace palette-led card repetition with ten meaning-driven video structures, preserve a center-framed speaker, add integrated semantic doodles, and publish a newly verified real-call example.

**Architecture:** The core package will own a V2 discriminated storyboard contract, semantic classification, content construction, and director validation. Remotion will implement ten independent frame-driven structures; the HyperFrames adapter will preserve the same semantic identifiers and safety metadata. The CLI will enforce separate Gate A/B/C/D transitions and a real-artifact QA pipeline before public evidence is updated.

**Tech Stack:** TypeScript 5.9, Zod 4, React 19, Remotion 4.0.507, optional HyperFrames HTML/GSAP adapter, Vitest 4, FFmpeg/ffprobe, Node.js 20+

---

## File map

### Core planning and contracts

- Create `packages/core/src/template-contracts.ts`: canonical V2 structure names, discriminated content schemas, copy limits, and placement permissions.
- Create `packages/core/src/content-builders.ts`: deterministic conversion from subtitle text and neighboring context into valid template content.
- Modify `packages/core/src/schema.ts`: V2 storyboard/beat schema and evidence/illustration contracts.
- Modify `packages/core/src/semantic-rules.ts`: semantic candidate classification; remove index-based visual rotation.
- Modify `packages/core/src/planner.ts`: eligibility scoring, safe placement, content construction, and cadence selection.
- Modify `packages/core/src/director-validation.ts`: semantic compatibility, diversity, copy length, evidence, side-lane, and full-screen checks.
- Modify `packages/core/src/reports.ts`: Gate A explanation of structure choice, evidence state, placement, and risks.

### Remotion visual implementation

- Create `packages/remotion-renderer/src/structures/shared.tsx`: typography, editorial surfaces, rails, source stamps, safe wrappers, and frame-derived helpers.
- Create ten focused components under `packages/remotion-renderer/src/structures/v2/`.
- Modify `packages/remotion-renderer/src/structures/types.ts`: discriminated V2 props.
- Create `packages/remotion-renderer/src/contrast.ts`: deterministic WCAG contrast calculation for visual tokens.
- Modify `packages/remotion-renderer/src/structures/index.ts`: V2 registry with one component identity per structure.
- Delete `packages/remotion-renderer/src/structures/components.tsx` after V2 registry migration.
- Delete `packages/remotion-renderer/src/structures/families.tsx` after all references are removed.
- Modify `packages/remotion-renderer/src/VideoPackaging.tsx`: pass typed content/evidence/illustrations into the selected structure and remove the generic detached doodle card.
- Modify `packages/remotion-renderer/src/theme.ts`: centralize presenter and subtitle bounds.

### Illustration, adapter, CLI, and evidence

- Create `packages/remotion-renderer/src/illustrations/SemanticDoodle.tsx`: integrated subject/action/outcome scene.
- Modify the six existing illustration components to expose explicit line, action, and result layers.
- Create `packages/hyperframes-adapter/src/v2-markup.ts`: structure-specific markup for the ten semantic identifiers.
- Modify `packages/hyperframes-adapter/src/templates.ts` and `generate.ts`: V2 structure markup and safety data.
- Create `scripts/lib/gates.ts`: cumulative approval checks and persisted gate records.
- Create `scripts/lib/artifact-qa.ts`: ffprobe, full decode, representative frame extraction, contact sheet, and manifest generation.
- Modify `scripts/package-video.ts`: separate Gate A/B/C/D behavior.
- Modify public docs, Skill instructions, examples, screenshots, checksum manifests, and CI-facing tests only after the real example passes.

---

### Task 1: Introduce the V2 semantic content contract

**Files:**
- Create: `packages/core/src/template-contracts.ts`
- Modify: `packages/core/src/schema.ts`
- Test: `packages/core/test/schema.test.ts`

- [ ] **Step 1: Replace the vocabulary test with the V2 contract expectations**

```ts
import {describe, expect, it} from 'vitest';
import {SEMANTIC_STRUCTURES, TemplateContentSchema} from '../src/template-contracts';

describe('V2 template contracts', () => {
  it('declares ten unique semantic structures', () => {
    expect(SEMANTIC_STRUCTURES).toEqual([
      'editorial-dual-rail', 'thesis-and-proof', 'bidirectional-flow',
      'command-palette', 'four-stage-pipeline', 'before-after-scrub',
      'evidence-panel', 'metric-odometer', 'signal-route', 'semantic-doodle',
    ]);
    expect(new Set(SEMANTIC_STRUCTURES).size).toBe(10);
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
```

- [ ] **Step 2: Run the focused test and verify the missing module failure**

Run: `npx vitest run packages/core/test/schema.test.ts`  
Expected: FAIL because `template-contracts.ts` and the V2 exports do not exist.

- [ ] **Step 3: Create the canonical structures and discriminated content schema**

```ts
import {z} from 'zod';

export const SEMANTIC_STRUCTURES = [
  'editorial-dual-rail', 'thesis-and-proof', 'bidirectional-flow',
  'command-palette', 'four-stage-pipeline', 'before-after-scrub',
  'evidence-panel', 'metric-odometer', 'signal-route', 'semantic-doodle',
] as const;

const short = (max: number) => z.string().trim().min(1).max(max);
const item = z.object({label: short(14), detail: short(22)});
const metric = z.object({
  value: short(12), unit: z.string().max(8), label: short(18),
  evidenceStatus: z.enum(['sourced', 'owner-confirmed', 'estimate']),
  sourceLabel: z.string().max(28).optional(),
});

export const TemplateContentSchema = z.discriminatedUnion('structure', [
  z.object({structure: z.literal('editorial-dual-rail'), kicker: short(18), headline: short(24), leftItems: z.array(item).min(1).max(3), rightItems: z.array(item).min(1).max(3), takeaway: short(24)}),
  z.object({structure: z.literal('thesis-and-proof'), thesis: short(24), reason: short(36), sourceLabel: z.string().max(28).optional(), sourceDetail: z.string().max(48).optional()}),
  z.object({structure: z.literal('bidirectional-flow'), leftLabel: short(14), rightLabel: short(14), forwardAction: short(18), returnAction: z.string().max(18).optional(), result: short(24)}),
  z.object({structure: z.literal('command-palette'), commandTitle: short(20), actions: z.array(short(22)).min(2).max(5), resultState: short(22)}),
  z.object({structure: z.literal('four-stage-pipeline'), title: short(24), stages: z.array(short(16)).min(3).max(4), output: z.string().max(22).optional()}),
  z.object({structure: z.literal('before-after-scrub'), before: short(24), after: short(24), criterion: short(18), delta: z.string().max(18).optional()}),
  z.object({structure: z.literal('evidence-panel'), evidenceAsset: short(120), caption: short(28), sourceLabel: short(28), interpretation: short(36)}),
  z.object({structure: z.literal('metric-odometer'), metrics: z.array(metric).min(1).max(3)}),
  z.object({structure: z.literal('signal-route'), nodes: z.array(short(14)).min(3).max(5), routeLabel: short(18), failureNode: z.string().max(14).optional(), result: short(22)}),
  z.object({structure: z.literal('semantic-doodle'), subject: short(14), action: short(18), outcome: short(20), accent: z.string().regex(/^#[0-9a-f]{6}$/i), annotation: z.string().max(22).optional()}),
]);

export type SemanticStructure = (typeof SEMANTIC_STRUCTURES)[number];
export type TemplateContent = z.infer<typeof TemplateContentSchema>;
```

- [ ] **Step 4: Update the storyboard schema to version 2 and require typed content**

```ts
import {SEMANTIC_STRUCTURES, TemplateContentSchema} from './template-contracts';

const beatSchema = z.object({
  id: z.string().min(1), start: z.number().min(0), end: z.number().positive(),
  text: z.string().min(1).max(80), structure: z.enum(SEMANTIC_STRUCTURES),
  content: TemplateContentSchema,
  motions: z.array(z.enum(MOTION_PRIMITIVES)).min(1).max(3),
  placement: z.enum(['left', 'right', 'full']), palette: z.enum(PALETTE_IDS),
  directorRole: z.enum(DIRECTOR_ROLES),
  evidence: z.object({src: z.string().min(1), label: z.string().min(1), sourceUrl: z.string().url().optional()}).optional(),
  illustration: z.object({type: z.enum(ILLUSTRATION_SCENARIOS), label: z.string().min(1).max(32)}).optional(),
}).superRefine((beat, context) => {
  if (beat.content.structure !== beat.structure) context.addIssue({code: 'custom', path: ['content', 'structure'], message: 'Content structure must match beat structure'});
});
```

Change the storyboard version literal from `1.0` to `2.0`, export `SemanticStructure` as `VisualStructure`, and retain the existing timing/order checks.

- [ ] **Step 5: Run schema tests**

Run: `npx vitest run packages/core/test/schema.test.ts`  
Expected: PASS with ten unique structures, matching content discriminators, and the existing timing/safe-placement checks.

- [ ] **Step 6: Commit the contract**

```bash
git add packages/core/src/template-contracts.ts packages/core/src/schema.ts packages/core/test/schema.test.ts
git commit -m "feat: define v2 semantic template contracts"
```

---

### Task 2: Build deterministic semantic content and structure selection

**Files:**
- Create: `packages/core/src/content-builders.ts`
- Modify: `packages/core/src/semantic-rules.ts`
- Modify: `packages/core/src/planner.ts`
- Test: `packages/core/test/planner.test.ts`

- [ ] **Step 1: Write classification and content-construction tests**

```ts
it.each([
  ['首先读取素材，然后分析，再生成方案，最后执行', 'four-stage-pipeline'],
  ['从手工剪辑变成自动化工作流', 'before-after-scrub'],
  ['输入脚本，生成视频，再根据反馈修正', 'bidirectional-flow'],
  ['运行检查、审核方案、确认导出', 'command-palette'],
  ['节点从选题流向脚本再到视频', 'signal-route'],
  ['本次只消耗了3%', 'metric-odometer'],
])('maps %s to %s', (text, structure) => {
  expect(classifySemanticStructure(text, 1)).toBe(structure);
});

it('builds content that validates for every planned beat', () => {
  const result = planStoryboard(fixtureInput);
  result.beats.forEach((beat) => {
    expect(beat.content.structure).toBe(beat.structure);
    expect(() => TemplateContentSchema.parse(beat.content)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the planner test and verify it fails against the old rotation planner**

Run: `npx vitest run packages/core/test/planner.test.ts`  
Expected: FAIL because `classifySemanticStructure`, V2 content, and semantic eligibility do not exist.

- [ ] **Step 3: Implement semantic classification without index-based family rotation**

```ts
export const classifySemanticStructure = (text: string, index: number): SemanticStructure => {
  if (/官方|证据|截图|来源|文档/.test(text)) return 'evidence-panel';
  if (/以前|现在|优化前|优化后|从.+变成|不是.+而是/.test(text)) return 'before-after-scrub';
  if (/首先|然后|接着|最后|第一|第二|第三|第四/.test(text)) return 'four-stage-pipeline';
  if (/运行|点击|打开|检查|审核|确认|输入命令/.test(text)) return 'command-palette';
  if (/反馈|来回|双向|输入.+输出|人.+AI|AI.+人/.test(text)) return 'bidirectional-flow';
  if (/路径|节点|流向|串联|闭环|连接/.test(text)) return 'signal-route';
  if (/\d|百分之|%|万|千|分钟|小时/.test(text)) return 'metric-odometer';
  if (/困难|卡住|推着|攀爬|起飞|平衡|转化/.test(text)) return 'semantic-doodle';
  if (/因为|原因|关键|证明|意味着/.test(text)) return 'thesis-and-proof';
  return index === 0 ? 'thesis-and-proof' : 'editorial-dual-rail';
};
```

- [ ] **Step 4: Implement focused content builders**

```ts
const clauses = (text: string) => text.split(/[，。；：,.!?！？]/).map((part) => part.trim()).filter(Boolean);

export const buildTemplateContent = (structure: SemanticStructure, text: string): TemplateContent => {
  const parts = clauses(text);
  if (structure === 'before-after-scrub') return {structure, before: parts[0] ?? text, after: parts[1] ?? '自动化流程', criterion: '工作方式'};
  if (structure === 'four-stage-pipeline') return {structure, title: parts[0] ?? '执行流程', stages: [...parts, '确认结果', '完成交付'].slice(0, 4).slice(0, Math.max(3, Math.min(4, parts.length + 1)))};
  if (structure === 'command-palette') return {structure, commandTitle: '执行清单', actions: [...parts, '检查结果'].slice(0, Math.max(2, Math.min(5, parts.length + 1))), resultState: '等待确认'};
  if (structure === 'metric-odometer') return {structure, metrics: [{value: text.match(/\d+(?:\.\d+)?/)?.[0] ?? '1', unit: text.includes('%') ? '%' : '', label: text.slice(0, 18), evidenceStatus: /本次|我的|实测/.test(text) ? 'owner-confirmed' : 'estimate'}]};
  if (structure === 'signal-route') return {structure, nodes: [...parts, '处理', '结果'].slice(0, Math.max(3, Math.min(5, parts.length + 2))), routeLabel: '信息路径', result: '形成闭环'};
  if (structure === 'bidirectional-flow') return {structure, leftLabel: parts[0] ?? '输入', rightLabel: parts[1] ?? '输出', forwardAction: '处理', returnAction: '反馈', result: '持续修正'};
  if (structure === 'semantic-doodle') return {structure, subject: '创作者', action: parts[0] ?? '推进任务', outcome: parts[1] ?? '得到结果', accent: '#e97a5f'};
  if (structure === 'thesis-and-proof') return {structure, thesis: parts[0] ?? text, reason: parts.slice(1).join('，') || '用清晰证据支撑观点'};
  return {structure: 'editorial-dual-rail', kicker: '核心信息', headline: parts[0] ?? text, leftItems: [{label: '现状', detail: parts[1] ?? '信息需要被整理'}], rightItems: [{label: '行动', detail: parts[2] ?? '给出清晰下一步'}], takeaway: parts.at(-1) ?? text};
};
```

Add explicit branches for `evidence-panel` and an optional planner evidence manifest; if a real asset is unavailable, downgrade that beat to `thesis-and-proof` rather than inventing evidence.

- [ ] **Step 5: Replace count-limited rotation with eligibility and cadence scoring**

The planner must score candidates in this order: semantic match, contract satisfiability, evidence availability, placement safety, adjacent-structure penalty, side-lane alternation, and whole-video diversity. It may use `editorial-dual-rail` as the ordinary fallback but may not select a different structure only because of the cue index.

```ts
const scoreCandidate = (candidate: SemanticStructure, context: SelectionContext): number =>
  context.semanticCandidates.indexOf(candidate) * -100
  - (candidate === context.previousStructure ? 25 : 0)
  - (context.counts.get(candidate) ?? 0) * 4
  + (context.canSatisfy(candidate) ? 30 : -1000);
```

- [ ] **Step 6: Run planner and schema tests**

Run: `npx vitest run packages/core/test/planner.test.ts packages/core/test/schema.test.ts`  
Expected: PASS; every beat has matching validated content, and the fixture maps to meaning-driven structures.

- [ ] **Step 7: Commit semantic planning**

```bash
git add packages/core/src/content-builders.ts packages/core/src/semantic-rules.ts packages/core/src/planner.ts packages/core/test/planner.test.ts
git commit -m "feat: plan structures from spoken semantics"
```

---

### Task 3: Enforce director, evidence, and safe-layout rules

**Files:**
- Modify: `packages/core/src/director-validation.ts`
- Modify: `packages/core/src/reports.ts`
- Test: `packages/core/test/director-validation.test.ts`

- [ ] **Step 1: Write failing checks for V2 quality gates**

```ts
it('rejects palette-only diversity, unsafe full-screen use, missing evidence, and excessive repetition', () => {
  const result = validateDirectorPlan(makeStoryboard([
    beat(1, {structure: 'editorial-dual-rail', placement: 'left'}),
    beat(2, {structure: 'editorial-dual-rail', placement: 'right', palette: 'violet-sunset'}),
    beat(3, {structure: 'editorial-dual-rail', placement: 'left', palette: 'teal-signal'}),
    beat(4, {structure: 'evidence-panel', placement: 'full', evidence: undefined}),
    beat(5, {structure: 'command-palette', placement: 'full', directorRole: 'definition'}),
  ]));
  expect(result.map((issue) => issue.code)).toEqual(expect.arrayContaining([
    'structure-run-too-long', 'evidence-missing', 'invalid-full-screen-role',
  ]));
});
```

- [ ] **Step 2: Run the validator test and verify new issue codes are missing**

Run: `npx vitest run packages/core/test/director-validation.test.ts`  
Expected: FAIL because the V2 validation issue codes and content checks are not implemented.

- [ ] **Step 3: Implement V2 director validation**

```ts
export type DirectorIssueCode =
  | 'structure-diversity' | 'structure-run-too-long' | 'side-repeat'
  | 'invalid-full-screen-role' | 'evidence-missing' | 'content-contract'
  | 'copy-too-long' | 'semantic-mismatch';

const fullScreenStructures = new Set<SemanticStructure>([
  'four-stage-pipeline', 'before-after-scrub', 'evidence-panel',
  'metric-odometer', 'signal-route', 'semantic-doodle', 'thesis-and-proof',
]);

if (storyboard.duration > 30 && uniqueStructures < 8) {
  issues.push({code: 'structure-diversity', message: 'Videos over 30 seconds should use eight semantically valid structures'});
}
if (beat.structure === 'evidence-panel' && !beat.evidence) {
  issues.push({code: 'evidence-missing', beatId: beat.id, message: 'Evidence panels require a real source asset'});
}
```

Track consecutive structure runs, ordinary side-lane repetition, full-screen role/structure permission, matching `beat.content.structure`, and content-schema errors. The maximum identical consecutive structure run is two.

- [ ] **Step 4: Expand Gate A reports with decision evidence**

Add `Why`, `Content contract`, `Evidence status`, and `Risk` columns to `storyboardMarkdown()`. Add the distinct-structure count and director issue count to `gateABrief()`.

```ts
| ID | Time | Structure | Why | Placement | Evidence | Copy |
|---|---:|---|---|---|---|---|
```

- [ ] **Step 5: Run core tests**

Run: `npx vitest run packages/core/test`  
Expected: PASS; director-invalid fixtures produce precise issue codes and valid fixtures remain clean.

- [ ] **Step 6: Commit the director gates**

```bash
git add packages/core/src/director-validation.ts packages/core/src/reports.ts packages/core/test/director-validation.test.ts
git commit -m "feat: enforce semantic director quality gates"
```

---

### Task 4: Establish shared editorial tokens and typed structure props

**Files:**
- Create: `packages/remotion-renderer/src/structures/shared.tsx`
- Modify: `packages/remotion-renderer/src/structures/types.ts`
- Create: `packages/remotion-renderer/src/contrast.ts`
- Modify: `packages/remotion-renderer/src/theme.ts`
- Test: `packages/remotion-renderer/test/structures.test.tsx`

- [ ] **Step 1: Write tests for protected lanes, typed content, and shared hierarchy**

```ts
it('keeps critical side content outside the center and subtitle reserves', () => {
  expect(presenterSafeZones).toEqual({
    center: {startPercent: 35, endPercent: 65},
    left: {startPercent: 5, endPercent: 32},
    right: {startPercent: 68, endPercent: 95},
    subtitleBottomPercent: 18,
  });
  expect(sideLaneStyle('left')).toMatchObject({left: '5%', width: '27%', bottom: '18%'});
});

it('keeps normal and large text at WCAG AA contrast', () => {
  expect(contrastRatio('#f6f2e8', '#0b1325')).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio('#55d7ff', '#0b1325')).toBeGreaterThanOrEqual(3);
});

it('requires full-screen surfaces to preserve a presenter window or use a dim layer', () => {
  const html = renderToStaticMarkup(<FullScreenSurface mode="presenter-window" palette={PALETTES['deep-ocean']}><span>结论</span></FullScreenSurface>);
  expect(html).toContain('data-presenter-window="35-65"');
  expect(html).toContain('data-subtitle-reserve="18"');
});
```

- [ ] **Step 2: Run the renderer structure test and verify it fails**

Run: `npx vitest run packages/remotion-renderer/test/structures.test.tsx`  
Expected: FAIL because `sideLaneStyle` and V2 structure props do not exist.

- [ ] **Step 3: Define typed props and optional illustration renderer**

```ts
import type {ComponentType} from 'react';
import type {TemplateContent} from '../../../core/src/template-contracts';
import type {IllustrationProps} from '../illustrations/types';

export type StructureProps = {
  content: TemplateContent;
  progress: number;
  palette: Palette;
  placement: 'left' | 'right' | 'full';
  evidence?: {src: string; label: string; sourceUrl?: string};
  Illustration?: ComponentType<IllustrationProps>;
};
```

- [ ] **Step 4: Implement shared primitives**

`shared.tsx` must export `Kicker`, `EditorialRule`, `NumberedItem`, `SourceStamp`, `SideSurface`, `FullScreenSurface`, `clamp01`, `phase`, and `rise`. Every primitive receives explicit colors and frame-derived progress.

```tsx
export const phase = (progress: number, start: number, end: number): number =>
  clamp01((progress - start) / Math.max(.001, end - start));

export const EditorialRule = ({progress, color}: {progress: number; color: string}) => (
  <div data-editorial-rule style={{height: 6, width: `${Math.round(phase(progress, .1, .7) * 100)}%`, background: color, borderRadius: 999}}/>
);
```

`FullScreenSurface` accepts `mode: 'presenter-window' | 'dim'`. Presenter-window mode leaves the center `35%–65%` transparent. Dim mode may darken A-roll but must keep the lower `18%` free of critical content.

- [ ] **Step 5: Implement deterministic contrast calculation**

```ts
const channel = (value: number): number => {
  const normalized = value / 255;
  return normalized <= .04045 ? normalized / 12.92 : ((normalized + .055) / 1.055) ** 2.4;
};

export const contrastRatio = (foreground: string, background: string): number => {
  const rgb = (hex: string) => [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  const luminance = (hex: string) => {
    const [r, g, b] = rgb(hex).map(channel);
    return .2126 * r + .7152 * g + .0722 * b;
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + .05) / (darker + .05);
};
```

- [ ] **Step 6: Update theme lane helpers**

```ts
export const sideLaneStyle = (side: 'left' | 'right') => ({
  position: 'absolute', top: '7%', bottom: '18%', width: '27%',
  ...(side === 'left' ? {left: '5%'} : {right: '5%'}),
} as const);
```

- [ ] **Step 7: Run focused tests and typecheck**

Run: `npx vitest run packages/remotion-renderer/test/structures.test.tsx && npm run typecheck`  
Expected: PASS for shared helpers; remaining old structures may require temporary test fixture updates within this task.

- [ ] **Step 8: Commit shared foundations**

```bash
git add packages/remotion-renderer/src/structures/shared.tsx packages/remotion-renderer/src/structures/types.ts packages/remotion-renderer/src/contrast.ts packages/remotion-renderer/src/theme.ts packages/remotion-renderer/test/structures.test.tsx
git commit -m "feat: add center-presenter editorial foundations"
```

---

### Task 5: Implement the six editorial and functional Remotion structures

**Files:**
- Create: `packages/remotion-renderer/src/structures/v2/EditorialDualRail.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/ThesisAndProof.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/BidirectionalFlow.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/CommandPalette.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/FourStagePipeline.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/BeforeAfterScrub.tsx`
- Test: `packages/remotion-renderer/test/structures.test.tsx`

- [ ] **Step 1: Add distinct-identity tests for the first six components**

```ts
const expected = {
  'editorial-dual-rail': 'dual-rail',
  'thesis-and-proof': 'thesis-proof',
  'bidirectional-flow': 'bidirectional-flow',
  'command-palette': 'command-palette',
  'four-stage-pipeline': 'four-stage-pipeline',
  'before-after-scrub': 'before-after-scrub',
} as const;

for (const [structure, identity] of Object.entries(expected)) {
  const html = renderStructure(structure, fixtureContent[structure]);
  expect(html).toContain(`data-structure-identity="${identity}"`);
  expect(html).toContain('data-critical-content="true"');
}
expect(new Set(Object.values(expected)).size).toBe(6);
```

- [ ] **Step 2: Run the test and verify all six modules are absent**

Run: `npx vitest run packages/remotion-renderer/test/structures.test.tsx`  
Expected: FAIL with missing component imports or registry entries.

- [ ] **Step 3: Implement `EditorialDualRail` and `ThesisAndProof`**

`EditorialDualRail` uses two framed side rails around the transparent center, numbered items, an editorial top line, and a bottom takeaway above the caption reserve. `ThesisAndProof` uses a large thesis on one side and a separately bordered proof/source area on the other.

```tsx
export const EditorialDualRail = (props: StructureProps): ReactElement => {
  if (props.content.structure !== 'editorial-dual-rail') throw new Error('EditorialDualRail received incompatible content');
  const {content, progress, palette} = props;
  return <AbsoluteFill data-structure-identity="dual-rail" data-critical-content="true">
    <SideSurface side="left" palette={palette}>{content.leftItems.map((item, index) => <NumberedItem key={item.label} index={index + 1} {...item} progress={phase(progress, .15 + index * .12, .55 + index * .12)}/>)}</SideSurface>
    <SideSurface side="right" palette={palette}>{content.rightItems.map((item, index) => <NumberedItem key={item.label} index={index + 1} {...item} progress={phase(progress, .25 + index * .12, .65 + index * .12)}/>)}</SideSurface>
  </AbsoluteFill>;
};
```

- [ ] **Step 4: Implement `BidirectionalFlow` and `CommandPalette`**

Use two anchored nodes and distinct forward/return SVG routes for `BidirectionalFlow`. Use a focused-action cursor, 2–5 rows, and a final status stamp for `CommandPalette`; do not use command styling for conceptual benefits.

- [ ] **Step 5: Implement `FourStagePipeline` and `BeforeAfterScrub`**

Use connected stages with persistent completion states for `FourStagePipeline`. Use exactly two anchored states and a deterministic scrub divider for `BeforeAfterScrub`.

```tsx
const scrub = `${Math.round(18 + phase(progress, .12, .82) * 64)}%`;
return <FullScreenSurface data-structure-identity="before-after-scrub" style={{clipPath: `inset(0 ${100 - Number.parseFloat(scrub)}% 0 0)`}}>...</FullScreenSurface>;
```

- [ ] **Step 6: Run tests and typecheck**

Run: `npx vitest run packages/remotion-renderer/test/structures.test.tsx && npm run typecheck`  
Expected: PASS for six independent identities and all typed content narrowing.

- [ ] **Step 7: Commit the first structure group**

```bash
git add packages/remotion-renderer/src/structures/v2 packages/remotion-renderer/test/structures.test.tsx
git commit -m "feat: add editorial and workflow structures"
```

---

### Task 6: Implement evidence, metric, route, and integrated doodle structures

**Files:**
- Create: `packages/remotion-renderer/src/structures/v2/EvidencePanel.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/MetricOdometer.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/SignalRoute.tsx`
- Create: `packages/remotion-renderer/src/structures/v2/SemanticDoodle.tsx`
- Create: `packages/remotion-renderer/src/illustrations/SemanticDoodle.tsx`
- Modify: `packages/remotion-renderer/src/illustrations/types.ts`
- Modify: `packages/remotion-renderer/src/illustrations/index.ts`
- Test: `packages/remotion-renderer/test/structures.test.tsx`
- Test: `packages/remotion-renderer/test/illustrations.test.tsx`

- [ ] **Step 1: Write failing tests for structure identity and doodle layering**

```ts
it('renders evidence, metric, route, and doodle as independent structures', () => {
  expect(renderV2('evidence-panel')).toContain('data-structure-identity="evidence-panel"');
  expect(renderV2('metric-odometer')).toContain('data-structure-identity="metric-odometer"');
  expect(renderV2('signal-route')).toContain('data-structure-identity="signal-route"');
  expect(renderV2('semantic-doodle')).toContain('data-structure-identity="semantic-doodle"');
});

it('renders doodle line, action, and outcome layers without a generic paper card', () => {
  const html = renderToStaticMarkup(<SemanticDoodle progress={.72} accent="#e97a5f" subject="创作者" action="推动流程" outcome="完成交付"/>);
  expect(html).toContain('data-doodle-layer="line"');
  expect(html).toContain('data-doodle-layer="action"');
  expect(html).toContain('data-doodle-layer="outcome"');
  expect(html).toContain('fill="none"');
  expect(html).not.toContain('data-generic-paper-card');
});
```

- [ ] **Step 2: Run tests and verify the four structures/layers are missing**

Run: `npx vitest run packages/remotion-renderer/test/structures.test.tsx packages/remotion-renderer/test/illustrations.test.tsx`  
Expected: FAIL with missing V2 components and doodle layers.

- [ ] **Step 3: Implement evidence and metric structures**

`EvidencePanel` gives the source asset the largest surface, renders the source label adjacent to it, and reveals interpretation last. `MetricOdometer` requires the evidence-status badge and never animates a value that cannot be safely parsed as a number.

```tsx
const numeric = /^-?\d+(?:\.\d+)?$/.test(metric.value);
const shown = numeric ? interpolateNumber(Number(metric.value), phase(progress, .18, .72)) : metric.value;
```

- [ ] **Step 4: Implement `SignalRoute` with explicit SVG safety**

All route paths must set `fill="none"`, `stroke`, `strokeWidth`, `strokeLinecap`, and `strokeDasharray` inline. Node count is 3–5; activation is driven by `phase(progress, ...)`.

- [ ] **Step 5: Implement the integrated semantic doodle**

```tsx
export type IllustrationProps = {
  progress: number; accent: string;
  subject?: string; action?: string; outcome?: string;
};

export const SemanticDoodle = ({progress, accent, subject = '人物', action = '执行', outcome = '结果'}: IllustrationProps) => (
  <svg viewBox="0 0 640 360" role="img" aria-label={`${subject}${action}${outcome}`}>
    <g data-doodle-layer="line" fill="none" stroke="#252933">...</g>
    <g data-doodle-layer="action" opacity={phase(progress, .2, .65)}>...</g>
    <g data-doodle-layer="outcome" opacity={phase(progress, .55, .95)}>...</g>
  </svg>
);
```

The scene uses transparent composition or context-matched local fills; it does not mount inside the old detached warm-paper card.

- [ ] **Step 6: Run illustration, structure, and type tests**

Run: `npx vitest run packages/remotion-renderer/test/structures.test.tsx packages/remotion-renderer/test/illustrations.test.tsx && npm run typecheck`  
Expected: PASS; all ten structures are independently identifiable and doodles retain explicit SVG safety.

- [ ] **Step 7: Commit the second structure group**

```bash
git add packages/remotion-renderer/src/structures/v2 packages/remotion-renderer/src/illustrations packages/remotion-renderer/test
git commit -m "feat: add evidence metrics routes and semantic doodles"
```

---

### Task 7: Replace family aliases and wire the V2 composition

**Files:**
- Modify: `packages/remotion-renderer/src/structures/index.ts`
- Delete: `packages/remotion-renderer/src/structures/components.tsx`
- Delete: `packages/remotion-renderer/src/structures/families.tsx`
- Modify: `packages/remotion-renderer/src/VideoPackaging.tsx`
- Modify: `packages/remotion-renderer/src/Root.tsx`
- Test: `packages/remotion-renderer/test/composition.test.ts`
- Test: `packages/remotion-renderer/test/structures.test.tsx`

- [ ] **Step 1: Add a registry-identity test that proves aliases are gone**

```ts
it('maps every V2 structure to a unique component function', () => {
  const components = Object.values(structureRegistry).map((entry) => entry.Component);
  expect(Object.keys(structureRegistry).sort()).toEqual([...SEMANTIC_STRUCTURES].sort());
  expect(new Set(components).size).toBe(10);
});
```

- [ ] **Step 2: Run the registry test and verify the existing six-family alias design fails**

Run: `npx vitest run packages/remotion-renderer/test/structures.test.tsx`  
Expected: FAIL because multiple names still share the same family component.

- [ ] **Step 3: Register one component per semantic structure**

```ts
export const structureRegistry: Record<SemanticStructure, StructureDefinition> = {
  'editorial-dual-rail': define('side', EditorialDualRail),
  'thesis-and-proof': define('side', ThesisAndProof),
  'bidirectional-flow': define('side', BidirectionalFlow),
  'command-palette': define('side', CommandPalette),
  'four-stage-pipeline': define('full', FourStagePipeline),
  'before-after-scrub': define('full', BeforeAfterScrub),
  'evidence-panel': define('full', EvidencePanel),
  'metric-odometer': define('full', MetricOdometer),
  'signal-route': define('full', SignalRoute),
  'semantic-doodle': define('full', SemanticDoodleStructure),
};
```

- [ ] **Step 4: Pass typed content and integrated assets from `BeatOverlay`**

```tsx
<Structure
  content={beat.content}
  progress={progress}
  palette={palette}
  placement={beat.placement}
  evidence={beat.evidence}
  Illustration={Illustration ?? undefined}
/>
```

Remove the generic illustration lane and generic evidence card from `VideoPackaging.tsx`; the selected structure owns those layout decisions.

- [ ] **Step 5: Update the default composition to a valid V2 storyboard**

Use `version: '2.0'`, `structure: 'thesis-and-proof'`, matching content, full placement, and the existing continuous media behavior.

- [ ] **Step 6: Run renderer tests and production composition discovery**

Run: `npm run typecheck && npx vitest run packages/remotion-renderer/test && npm run build`  
Expected: PASS; Remotion lists `VideoPackaging`, and the registry exposes ten unique components.

- [ ] **Step 7: Delete the old family files and verify no references remain**

Run: `rg -n "ImpactFamily|GradientFamily|SupportingFamily|families|components" packages/remotion-renderer/src`  
Expected: no matches referring to the removed family implementation.

- [ ] **Step 8: Commit the V2 composition**

```bash
git add packages/remotion-renderer/src packages/remotion-renderer/test
git commit -m "refactor: wire independent v2 remotion structures"
```

---

### Task 8: Bring the optional HyperFrames output onto the V2 contract

**Files:**
- Create: `packages/hyperframes-adapter/src/v2-markup.ts`
- Modify: `packages/hyperframes-adapter/src/templates.ts`
- Modify: `packages/hyperframes-adapter/src/generate.ts`
- Test: `packages/hyperframes-adapter/test/generate.test.ts`

- [ ] **Step 1: Write tests for structure-specific markup and safety metadata**

```ts
it('preserves all V2 identifiers and does not collapse them into one generic shell', () => {
  const project = generateHyperFramesProject(v2StoryboardWithTenBeats());
  for (const structure of SEMANTIC_STRUCTURES) {
    expect(project.html).toContain(`data-semantic-structure="${structure}"`);
  }
  expect(new Set(SEMANTIC_STRUCTURES.map((name) => markupIdentity(name))).size).toBe(10);
  expect(project.html).toContain('data-presenter-safe-center="35-65"');
  expect(project.html).toContain('data-subtitle-safe-bottom="18"');
});
```

- [ ] **Step 2: Run the adapter test and verify the generic beat shell fails**

Run: `npx vitest run packages/hyperframes-adapter/test/generate.test.ts`  
Expected: FAIL because current markup uses one generic heading/rail shell.

- [ ] **Step 3: Implement ten markup renderers**

```ts
const renderers: Record<SemanticStructure, (beat: StoryboardBeat) => string> = {
  'editorial-dual-rail': renderDualRail,
  'thesis-and-proof': renderThesisProof,
  'bidirectional-flow': renderBidirectionalFlow,
  'command-palette': renderCommandPalette,
  'four-stage-pipeline': renderPipeline,
  'before-after-scrub': renderBeforeAfter,
  'evidence-panel': renderEvidence,
  'metric-odometer': renderMetric,
  'signal-route': renderSignalRoute,
  'semantic-doodle': renderDoodle,
};
```

Each renderer escapes text, emits the semantic identifier, and uses the same content contract; evidence URLs and labels must be escaped.

- [ ] **Step 4: Generate seek-safe motion per structure**

Use paused GSAP timelines driven by absolute storyboard seconds. Avoid runtime timers, random values, and stateful CSS transitions. Keep `appearsBy` and `staysInFrame` assertions for every beat.

- [ ] **Step 5: Run adapter tests and public scan**

Run: `npx vitest run packages/hyperframes-adapter/test/generate.test.ts && npm run verify:public`  
Expected: PASS; ten identifiers and safety metadata are present, and no forbidden local data is introduced.

- [ ] **Step 6: Commit adapter parity**

```bash
git add packages/hyperframes-adapter
git commit -m "feat: preserve v2 semantics in hyperframes output"
```

---

### Task 9: Separate Gate A/B/C/D and add artifact-level QA

**Files:**
- Create: `scripts/lib/gates.ts`
- Create: `scripts/lib/artifact-qa.ts`
- Modify: `scripts/package-video.ts`
- Test: `tests/gate-cli.test.ts`
- Test: `tests/artifact-qa.test.ts`

- [ ] **Step 1: Write CLI gate-transition tests**

```ts
it('stops at Gate A without approval', () => {
  const result = runCli(baseArgs);
  expect(result.stdout).toContain('Gate A complete');
  expect(exists('run/renders/packaged.mp4')).toBe(false);
});

it('refuses render unless every cumulative approval is explicit', () => {
  const result = runCli([...baseArgs, '--approve-gate-a', '--approve-gate-b', '--approve-gate-c', '--render']);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toMatch(/approve-gate-d/i);
});
```

- [ ] **Step 2: Run the new tests and verify the current two-flag flow fails**

Run: `npx vitest run tests/gate-cli.test.ts tests/artifact-qa.test.ts`  
Expected: FAIL because separate gates and artifact helpers do not exist.

- [ ] **Step 3: Implement cumulative approval parsing**

```ts
export type Gate = 'A' | 'B' | 'C' | 'D';
export const approvedGate = (args: Args): Gate => {
  if (args['approve-gate-d'] === true) return 'D';
  if (args['approve-gate-c'] === true) return 'C';
  if (args['approve-gate-b'] === true) return 'B';
  if (args['approve-gate-a'] === true) return 'A';
  return 'A';
};

export const requireCumulativeApprovals = (args: Args, target: Gate): void => {
  const required = target === 'D'
    ? ['approve-gate-a', 'approve-gate-b', 'approve-gate-c', 'approve-gate-d']
    : target === 'C' ? ['approve-gate-a', 'approve-gate-b', 'approve-gate-c']
    : target === 'B' ? ['approve-gate-a', 'approve-gate-b'] : [];
  const missing = required.filter((name) => args[name] !== true);
  if (missing.length) throw new Error(`Missing explicit approvals: ${missing.map((name) => `--${name}`).join(', ')}`);
};
```

The exact behavior is: no approval writes Gate A only; A+B writes composition inputs; A+B+C generates review stills and QA without final MP4; A+B+C+D plus `--render` produces the final artifact.

- [ ] **Step 4: Implement artifact verification**

`artifact-qa.ts` must expose `probeOutput`, `decodeEntireFile`, `extractRepresentativeFrames`, `detectBlackFrames`, `buildContactSheet`, and `writeRenderManifest`. All subprocess calls use argument arrays, `shell: false`, and checked exit codes.

```ts
export const decodeEntireFile = (file: string): void => {
  const result = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'null', '-'], {stdio: 'pipe', shell: false, windowsHide: true});
  if (result.status !== 0) throw new Error(`Full decode failed: ${result.stderr.toString('utf8')}`);
};
```

- [ ] **Step 5: Extract eight semantically representative frames**

Select one midpoint from eight distinct structures; if the storyboard contains fewer than eight structures, Gate C fails. Use FFmpeg to extract exact frames and `tile=4x2` to create the contact sheet. Record each file, timestamp, structure, SHA-256, dimensions, and source output SHA-256.

- [ ] **Step 6: Run CLI and QA tests**

Run: `npx vitest run tests/gate-cli.test.ts tests/artifact-qa.test.ts`  
Expected: PASS; no final render is possible without cumulative explicit approvals.

- [ ] **Step 7: Commit gate enforcement and QA**

```bash
git add scripts/lib scripts/package-video.ts tests/gate-cli.test.ts tests/artifact-qa.test.ts
git commit -m "feat: enforce four-gate rendering and artifact qa"
```

---

### Task 10: Update Skill instructions and tests before the real call

**Files:**
- Modify: `SKILL.md`
- Modify: `references/director-rules.md`
- Modify: `references/visual-structures.md`
- Modify: `references/motion-and-illustration.md`
- Modify: `references/gates.md`
- Modify: `references/qa-and-troubleshooting.md`
- Modify: `docs/USAGE.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tests/skill/skill-contract.test.ts`
- Modify: `tests/readme-integrity.test.ts`

- [ ] **Step 1: Write tests for the public Skill contract**

```ts
it('documents the ten V2 structures and the cumulative gate flow', () => {
  const skill = readFileSync('SKILL.md', 'utf8');
  for (const name of SEMANTIC_STRUCTURES) expect(skill).toContain(name);
  expect(skill).toContain('--approve-gate-d');
  expect(skill).toContain('35%–65%');
  expect(skill).toContain('18%');
});

it('preserves the requested closing contact', () => {
  expect(readFileSync('README.md', 'utf8')).toContain('感兴趣的朋友欢迎咨询业务微信：nanaya093');
});
```

- [ ] **Step 2: Run Skill contract tests and verify V2 documentation is missing**

Run: `npx vitest run tests/skill/skill-contract.test.ts tests/readme-integrity.test.ts`  
Expected: FAIL because current docs still advertise the old 18-name/six-family system and old render flags.

- [ ] **Step 3: Rewrite the structure, gate, and illustration references**

Document the exact trigger, required fields, forbidden usage, placement, and motion contract for each V2 structure. Explain that doodles clarify action/transformation and never act as evidence. Show Remotion as the default full implementation and HyperFrames as an optional compatible output.

- [ ] **Step 4: Bump the package release to 0.2.0**

Run: `npm version 0.2.0 --no-git-tag-version`  
Expected: `package.json` and `package-lock.json` both report `0.2.0`; no Git tag is created.

- [ ] **Step 5: Update usage commands to the four gates**

```bash
# Gate A
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in

# Gate B
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b

# Gate C review
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c

# Gate D final render
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c --approve-gate-d --render
```

- [ ] **Step 6: Run documentation and public-repository tests**

Run: `npx vitest run tests/skill/skill-contract.test.ts tests/readme-integrity.test.ts tests/public-verifier.test.ts && npm run verify:public`  
Expected: PASS; the requested closing copy is unchanged and the repository remains clean.

- [ ] **Step 7: Commit the V2 Skill contract**

```bash
git add SKILL.md references docs/USAGE.md package.json package-lock.json tests/skill/skill-contract.test.ts tests/readme-integrity.test.ts
git commit -m "docs: teach the v2 semantic packaging workflow"
```

---

### Task 11: Run the real example through Gate A and stop for approval

**Files:**
- Regenerate: `examples/auto-editing-0/input-manifest.json`
- Regenerate: `examples/auto-editing-0/storyboard.json`
- Regenerate: `examples/auto-editing-0/README.md`
- Create: `examples/auto-editing-0/GATE_A.md`

- [ ] **Step 1: Copy authorized inputs only into ignored runtime input paths**

Use `examples/auto-editing-0/private-input/`, which must remain excluded by `.gitignore`. Confirm `git status --short` does not show the source video or subtitle file.

- [ ] **Step 2: Execute Gate A only**

Run:

```bash
npm run package-video -- --video examples/auto-editing-0/private-input/input.mp4 --srt examples/auto-editing-0/private-input/input.srt --out examples/auto-editing-0/run-v2 --renderer remotion --captions burned-in
```

Expected: command reports `Gate A complete`; no final MP4 exists; the storyboard contains V2 content and at least eight semantically valid structures.

- [ ] **Step 3: Validate the Gate A plan**

Run: `node -e "const s=require('./examples/auto-editing-0/run-v2/storyboard.json'); const u=new Set(s.beats.map(b=>b.structure)); if(u.size<8) throw new Error('fewer than eight structures'); console.log([...u])"`  
Expected: eight or more V2 semantic identifiers, no content/structure mismatch, and no invented evidence.

- [ ] **Step 4: Present Gate A to Nana and stop**

Provide the structure list, full-screen timestamps, side-lane alternation, doodle timestamps, evidence status, maximum scene duration, and factual-risk notes. Do not run Gate B/C/D until Nana explicitly approves this exact example.

- [ ] **Step 5: After approval, commit only public Gate A derivatives**

```bash
git add examples/auto-editing-0/input-manifest.json examples/auto-editing-0/storyboard.json examples/auto-editing-0/README.md examples/auto-editing-0/GATE_A.md
git commit -m "docs: record v2 real-call gate a"
```

---

### Task 12: Produce Gate B/C review evidence and stop for visual approval

**Files:**
- Create: `examples/auto-editing-0/GATE_B.md`
- Create: `examples/auto-editing-0/GATE_C.md`
- Create: `examples/auto-editing-0/run-v2/review/` ignored runtime artifacts

- [ ] **Step 1: Run cumulative Gate B and Gate C after explicit Gate A approval**

Run:

```bash
npm run package-video -- --video examples/auto-editing-0/private-input/input.mp4 --srt examples/auto-editing-0/private-input/input.srt --out examples/auto-editing-0/run-v2 --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c
```

Expected: eight review stills and a contact sheet exist; final `packaged.mp4` does not exist.

- [ ] **Step 2: Run automated visual checks**

Run: `npm test && npm run typecheck && npm run build`  
Expected: all tests pass; center-lane, subtitle-band, copy-length, contrast, structure-count, and SVG checks report no errors.

- [ ] **Step 3: Manually review all eight frames**

Review for: real structural difference, content hierarchy, speaker-face clearance, burned-in subtitle clearance, evidence legibility, doodle action/result, no repeated universal card, and no color-only variation.

- [ ] **Step 4: Present the contact sheet to Nana and stop**

Do not perform Gate D final rendering until Nana explicitly approves the reviewed V2 look.

- [ ] **Step 5: Commit Gate B/C reports only after approval**

```bash
git add examples/auto-editing-0/GATE_B.md examples/auto-editing-0/GATE_C.md
git commit -m "docs: record v2 visual review gates"
```

---

### Task 13: Render Gate D, replace public evidence, and verify the final artifact

**Files:**
- Replace: `docs/assets/previews/auto-editing-0-*.png`
- Replace: `docs/assets/previews/auto-editing-0-contact-sheet.jpg`
- Modify: `examples/auto-editing-0/preview-manifest.json`
- Modify: `examples/auto-editing-0/QA_REPORT.md`
- Modify: `README.md`
- Modify: `docs/EXAMPLES.md`
- Modify: `examples/auto-editing-0/README.md`

- [ ] **Step 1: Run Gate D only after explicit export approval**

Run:

```bash
npm run package-video -- --video examples/auto-editing-0/private-input/input.mp4 --srt examples/auto-editing-0/private-input/input.srt --out examples/auto-editing-0/run-v2 --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c --approve-gate-d --render
```

Expected: final MP4 exists, render exits zero, artifact manifest records SHA-256, ffprobe fields, full decode, black-frame result, eight frame records, and contact-sheet checksum.

- [ ] **Step 2: Independently verify the final output**

Run:

```bash
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,channels -of json examples/auto-editing-0/run-v2/renders/packaged.mp4
ffmpeg -v error -i examples/auto-editing-0/run-v2/renders/packaged.mp4 -f null -
```

Expected: 1920×1080, 30fps H.264 video, AAC audio, duration aligned with source within the documented tolerance, and full decode with no errors.

- [ ] **Step 3: Replace old previews with the eight verified V2 frames**

Copy only the eight manifest-listed frames and generated contact sheet into `docs/assets/previews/`. Remove the six old frame files. Ensure every README path resolves.

- [ ] **Step 4: Update README facts from the new manifest**

Update structure count, frame count, duration, output codec, file size, and SHA-256. Do not estimate these fields. Preserve the full requested closing section verbatim, ending in `nanaya093`.

- [ ] **Step 5: Run the complete repository gate**

Run:

```bash
npm run verify:all
npm audit --omit=dev
git diff --check
git status --short
```

Expected: tests, typecheck, build, public scan, audit, and diff check pass; status contains only intended public derivatives and source inputs remain untracked and ignored.

- [ ] **Step 6: Regenerate checksums and re-run the public scan**

Run: `npm run checksums && npm run verify:public`  
Expected: checksum manifest matches all tracked release files and public verification reports `ok: true`.

- [ ] **Step 7: Commit the verified V2 public evidence**

```bash
git add README.md docs examples/auto-editing-0 scripts package.json package-lock.json
git commit -m "feat: publish verified semantic template system v2"
```

---

### Task 14: Final branch review and authorized GitHub update

**Files:**
- Review all files changed since `50dfc4f`

- [ ] **Step 1: Review scope and secrets**

Run:

```bash
git diff --stat 50dfc4f..HEAD
git diff --check 50dfc4f..HEAD
git log --oneline 50dfc4f..HEAD
npm run verify:all
```

Expected: only V2 contracts, implementations, tests, docs, and verified public evidence changed; all gates pass.

- [ ] **Step 2: Inspect tracked binary files and local paths**

Run: `git ls-files | rg "\.(mp4|mov|mkv|wav|mp3|srt|env|pem|key)$"`  
Expected: no source media, source subtitle, environment, or key files are tracked.

- [ ] **Step 3: Confirm GitHub scope with Nana**

Report the commit list, final render evidence, screenshot contact sheet, output hash, test results, and any remaining risks. Do not push while any verification is failing.

- [ ] **Step 4: Push only after the already-authorized public-update scope remains unchanged**

```bash
git push -u origin design/semantic-template-system-v2
```

Expected: remote branch is created. Merge or direct-main update follows the user's chosen GitHub workflow; no deployment or unrelated repository changes occur.

- [ ] **Step 5: Verify the remote repository and CI**

Check the remote commit SHA, README image rendering, and GitHub Actions result. The task is complete only when the public page shows the new real-call evidence and CI passes.
