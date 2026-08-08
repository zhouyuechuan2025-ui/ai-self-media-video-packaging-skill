# Semantic Template System V2 — Design Specification

**Status:** Implemented and verified against the `auto-editing-0` real invocation
**Target:** Public `ai-self-media-video-packaging-skill` repository
**Primary use case:** 16:9, center-framed talking-head footage with burned-in or separately managed captions

## 1. Problem statement

The current public example demonstrates color variation, but it does not yet demonstrate enough structural or editorial variation. Several scenes reuse the same visual grammar with different colors, so the result reads like decorated text rather than designed video packaging.

V2 must improve the result at the template-system level. It must select a structure because that structure matches the meaning of the spoken segment, not because a palette rotation is due.

The public package remains self-contained: the repository must include every rule, component, token, test, and example artifact required to reproduce its advertised result.

## 2. Goals

V2 must:

1. Provide ten genuinely different semantic structures instead of aliases around a few card layouts.
2. Preserve the on-camera speaker when the person occupies the center of the frame.
3. Use the left and right sides as designed editorial rails, not loose text dumping zones.
4. Reserve full-screen graphics for moments where replacing or dimming the A-roll materially improves comprehension.
5. Generate programmatic line illustrations when an abstract concept is clearer as an action or process.
6. Plan first, require explicit approval, and only then render.
7. Re-run the `auto-editing-0` case and publish screenshots taken from that real run.
8. Keep Remotion as the default renderer and keep the HyperFrames adapter available as an optional compatible output path.

## 3. Non-goals

V2 does not include:

- a graphical editing application;
- automatic publishing, uploading, payments, or account operations;
- unrestricted template cloning or one-to-one reproduction of third-party artwork;
- fabricated metrics, testimonials, product capabilities, or source attributions;
- bundled source footage, source subtitles, credentials, cookies, or machine-specific paths.

## 4. Required workflow and approval gates

Every invocation follows four explicit gates:

### Gate A — Analysis and proposal

The Skill inspects media metadata and subtitles, identifies semantic beats, proposes structures, flags factual risks, and writes a human-readable plan. It must not render the final result at this gate.

### Gate B — Approved storyboard

After explicit approval, the Skill creates the deterministic timeline, fills template contracts, prepares allowed evidence or illustrations, and produces storyboard evidence. It does not claim final delivery.

### Gate C — Interactive or frame-level review

The Skill builds the real composition, runs automated checks, and produces representative review frames. Defects return to Gate B or implementation as appropriate.

### Gate D — Final render

Only an explicit Gate D approval permits final rendering. The produced file must be inspected as an artifact, not inferred from a successful command.

## 5. Frame and safety model

The reference canvas is 1920×1080.

### Center-presenter mode

- Protected presenter lane: `x = 35%–65%`.
- Left editorial lane: `x = 5%–32%`.
- Right editorial lane: `x = 68%–95%`.
- Bottom caption reserve: the lower `18%` of the frame unless the source is explicitly caption-free.
- Critical text, evidence, diagrams, and counters must not enter the protected presenter or caption lanes.
- No foreground surface, text, path, glow, or illustration may cross the protected lane.

### Full-screen mode

Full-screen treatment is permitted only for:

- the opening hook;
- a process that requires three or more connected stages;
- before/after comparison;
- evidence inspection;
- a numeric conclusion;
- the final summary or CTA.

Full-screen scenes use an opaque edge-to-edge background. There is no translucent hybrid mode: if meaningful geometry enters the presenter lane, the presenter is intentionally replaced for that beat.

### Side-card density

- Side surfaces follow content height and never fill the lane from a fixed top to bottom.
- Maximum card height is 64% of the frame.
- One idea uses one compact rail; two rails require two genuinely complementary groups.
- Representative review frames are sampled at 72% of the beat, then manually checked for face safety, empty space, clipping, contrast, semantic fit, and subtitle clearance.

## 6. Semantic template library

Each template is a distinct component with its own content schema, layout, and motion contract. Palette changes do not create a new structure.

### 6.1 `editorial-dual-rail`

**Use for:** a main argument with two complementary groups of supporting points.
**Layout:** center presenter; framed left and right rails; top kicker; footer takeaway.
**Required fields:** `kicker`, `headline`, `leftItems[1..3]`, `rightItems[1..3]`, `takeaway`.
**Motion:** header settles first, rails enter from opposite sides, numbered items reveal in reading order, takeaway locks last.
**Do not use for:** a sequential process or direct comparison.

### 6.2 `thesis-and-proof`

**Use for:** one strong claim that requires a concise reason, source, or observation.
**Layout:** large thesis on one side; proof block with source label on the other; center presenter remains open.
**Required fields:** `thesis`, `reason`, optional `sourceLabel`, optional `sourceDetail`.
**Motion:** thesis hits, reason lifts, source stamp appears only after the proof is readable.
**Do not use for:** unsupported promotional claims.

### 6.3 `bidirectional-flow`

**Use for:** input/output, tool/human, problem/solution, or two-way feedback relationships.
**Layout:** left and right nodes connected around the presenter lane; return path is visually distinct.
**Required fields:** `leftLabel`, `rightLabel`, `forwardAction`, optional `returnAction`, `result`.
**Motion:** forward route draws first; return route draws only when the narration establishes a feedback loop.
**Do not use for:** a one-direction timeline.

### 6.4 `command-palette`

**Use for:** executable actions, commands, shortcuts, or a small operational checklist.
**Layout:** compact command surface on one side, output or status summary on the other.
**Required fields:** `commandTitle`, `actions[2..5]`, `resultState`.
**Motion:** focus bar moves through actions; result state stamps after the final action.
**Do not use for:** general benefits or conceptual nouns.

### 6.5 `four-stage-pipeline`

**Use for:** exactly three or four ordered operational stages.
**Layout:** full-screen or side-spanning connected stages with a visible current-stage indicator.
**Required fields:** `title`, `stages[3..4]`, optional `output`.
**Motion:** route draws once; stages activate in chronological order; completed stages remain legible.
**Do not use for:** unordered lists.

### 6.6 `before-after-scrub`

**Use for:** exactly two comparable states with a stable comparison dimension.
**Layout:** split field or scrub bar; labels remain anchored; the comparison criterion stays visible.
**Required fields:** `before`, `after`, `criterion`, optional `delta`.
**Motion:** reveal progresses from before to after; delta appears only if it is sourced or explicitly presented as an estimate.
**Do not use for:** three alternatives or non-comparable examples.

### 6.7 `evidence-panel`

**Use for:** screenshots, documentation, research excerpts, or verifiable artifacts.
**Layout:** evidence image or excerpt receives the largest area; interpretation and source are secondary.
**Required fields:** `evidenceAsset`, `caption`, `sourceLabel`, `interpretation`.
**Motion:** evidence enters first, crop or highlight follows, interpretation appears last.
**Do not use for:** decorative stock imagery or invented proof.

### 6.8 `metric-odometer`

**Use for:** one to three real numeric values central to the spoken point.
**Layout:** large number, unit, meaning label, and source/estimate status.
**Required fields:** `metrics[1..3]`, each with `value`, `unit`, `label`, and `evidenceStatus`.
**Motion:** numbers count only when interpolation is honest; otherwise use a direct hit or step change.
**Do not use for:** numbers without a source or clearly stated owner estimate.

### 6.9 `signal-route`

**Use for:** a system path, dependency chain, handoff, or data route with three to five nodes.
**Layout:** route avoids the presenter lane or uses full-screen dim mode; nodes have distinct roles.
**Required fields:** `nodes[3..5]`, `routeLabel`, optional `failureNode`, `result`.
**Motion:** line draw, node activation, optional failure pulse, result lock.
**Do not use for:** a simple list disguised as a diagram.

### 6.10 `semantic-doodle`

**Use for:** an abstract idea best explained through a human action, transformation, or cause/effect metaphor.
**Layout:** one clear subject, one action, and one outcome; avoid white-card default framing.
**Required fields:** `subject`, `action`, `outcome`, `accent`, optional `annotation`.
**Motion:** line path draws, local color blocks reveal, subject acts, result appears.
**Do not use for:** generic decoration or a literal restatement of the subtitle.

## 7. Visual system

### Typography hierarchy

- Kicker or category: compact, high-contrast, visually subordinate.
- Display claim: the largest text in the frame, normally one sentence or two short lines.
- Card heading: visually distinct from body copy.
- Body copy: short clauses, not paragraphs.
- Source or status label: always readable and never used as decoration.

Default copy limits:

- Display claim: maximum 24 Chinese characters or 80 Latin characters.
- Card heading: maximum 14 Chinese characters or 48 Latin characters.
- Body item: maximum 22 Chinese characters or 72 Latin characters.
- Source label: maximum 28 Chinese characters or 90 Latin characters.

### Color

- Each scene uses a base, one dominant accent, and at most one support accent.
- Adjacent scenes must not differ only by hue.
- Palette choice follows semantic tone: operational, evidentiary, comparative, cautionary, or conclusive.
- Text contrast must meet WCAG AA: 4.5:1 for normal text and 3:1 for large text.

### Surfaces and depth

- Side rails use controlled transparency, borders, editorial rules, and layered spacing.
- Full-screen structures may use paper, console, blueprint, or evidence surfaces when semantically appropriate.
- Shadows, glow, grain, and gradients are support devices, never substitutes for hierarchy.

## 8. Motion system

All default Remotion motion is frame-derived and deterministic.

- Normal scene target: 3–5 seconds.
- Hard scene limit: 6 seconds unless evidence readability requires a documented exception.
- Entry or emphasis phase: normally 0.4–0.8 seconds.
- No wall-clock timers or runtime-only CSS animation dependencies.
- Every scene must render correctly when seeking directly to any frame.
- Exiting elements may not leave important content partially clipped at scene boundaries.

Illustration rules:

- SVG paths explicitly set `fill="none"` where appropriate.
- Line drawing uses deterministic dash offsets.
- Color fills are local accents, not full-card recolors.
- At least three visual layers must participate: line, subject/action, and outcome/annotation.

## 9. Director selection rules

The director pipeline is:

1. classify the subtitle beat;
2. identify eligible structures;
3. reject structures whose content contracts cannot be satisfied;
4. choose placement from speaker and caption safety metadata;
5. score cadence diversity without overriding semantic fitness;
6. write the Gate A proposal;
7. materialize only after approval;
8. validate and render.

Selection triggers:

- `step`, `stage`, `first/next/final` → `four-stage-pipeline` or `signal-route`;
- `before/after`, `instead`, `from/to` → `before-after-scrub`;
- `according to`, `documentation`, `screenshot`, `evidence` → `evidence-panel`;
- a central numeric statement → `metric-odometer`;
- an executable sequence → `command-palette`;
- a claim plus support → `thesis-and-proof`;
- complementary categories → `editorial-dual-rail`;
- two-way handoff or feedback → `bidirectional-flow`;
- abstract human action or transformation → `semantic-doodle`.

Cadence rules:

- The same structure may not appear more than twice consecutively.
- A video longer than 30 seconds should normally use at least eight distinct structures when the semantics support them.
- Left and right emphasis should alternate over time.
- Full-screen structures should not appear consecutively unless they form one deliberate sequence.
- Diversity checks may flag a weak plan, but they must not force a semantically incorrect template.

## 10. Code architecture

### Core planner

The core package owns:

- beat classification;
- template eligibility and scoring;
- content-schema validation;
- center-presenter and caption-safe layout metadata;
- gate manifests;
- factual-risk labels.

### Remotion renderer

The Remotion package owns:

- ten independent template components;
- shared typography, tokens, safe-area helpers, evidence surfaces, and SVG primitives;
- deterministic frame-based motion;
- the default final renderer.

Existing family aliases that map different names to the same layout must be removed or retained only as compatibility shims that resolve to a documented V2 structure.

### HyperFrames adapter

The adapter remains supported as an optional output path. It must preserve the same manifest, timing, safe areas, evidence status, and semantic structure identifiers. Its presence does not replace the Remotion implementation or its tests.

## 11. Real-call example

The `auto-editing-0` example will be regenerated with V2.

Required outputs:

- Gate A analysis and approved plan;
- machine-readable timeline manifest;
- final Remotion render generated from the real example invocation;
- eight representative screenshots covering at least eight structures;
- one contact sheet assembled from those exact frames;
- artifact metadata and checksums;
- a short factual note distinguishing source claims, owner-confirmed claims, and estimates.

The existing preview set must be replaced rather than presented alongside the new evidence. README images must point only to the new verified screenshots.

## 12. Test strategy

Implementation follows test-driven development.

### Unit and contract tests

- every template has a distinct schema and renderer identity;
- semantic triggers map to eligible templates;
- invalid template/meaning combinations are rejected;
- copy-length, evidence-status, presenter-safe, and caption-safe rules fail loudly;
- same-structure and palette-only repetition is detected;
- SVG illustration paths preserve explicit fill and stroke semantics.

### Composition tests

- all ten structures appear in the Remotion composition catalogue;
- direct seek snapshots are stable;
- center-presenter and subtitle reserves contain no critical overlay bounds;
- contrast meets required thresholds;
- no important content clips or overflows.

### Real artifact tests

- final render exists and has expected non-zero size;
- `ffprobe` confirms intended resolution, frame rate, duration, video, and audio streams;
- full-file decode completes without error;
- black-frame and frozen-frame checks pass or produce reviewed exceptions;
- eight representative screenshots are manually reviewed against their semantic contracts;
- published screenshots are confirmed to come from the final artifact or the exact approved composition state.

## 13. Public repository hygiene

Before any push:

- scan tracked files for `.env`, keys, tokens, cookies, private keys, credentials, absolute machine paths, source media, source subtitle files, temporary browser state, and runtime caches;
- verify that all screenshots are intended for public release;
- keep example input media excluded from Git;
- include licenses and attribution for any reused open-source code or assets;
- ensure README claims match verified capabilities;
- retain the approved final business contact `nanaya093` only in the requested closing copy.

## 14. Acceptance criteria

V2 is accepted only when all of the following are true:

1. Ten independent semantic structures exist and are documented.
2. At least eight structures are visibly present in the regenerated real example.
3. The example is not dominated by free-floating colored text or one repeated card layout.
4. The center presenter and burned-in subtitle areas remain readable throughout manual review.
5. Programmatic doodles demonstrate line drawing, local color, action, and result.
6. Gate A is generated before implementation and final rendering requires explicit Gate D approval.
7. Unit tests, typecheck, build, public-repository scan, composition checks, and artifact checks pass.
8. README preview images are replaced with screenshots from the regenerated real invocation.
9. No source media, source subtitles, credentials, machine-specific paths, or unintended internal material are tracked.
10. The requested README closing copy, including business WeChat `nanaya093`, remains unchanged.

## 15. Delivery sequence

1. Approve this written specification.
2. Produce a file-by-file implementation plan.
3. Add failing contract tests for semantic structures and safety rules.
4. Implement the core planner and ten Remotion templates.
5. Update the HyperFrames adapter contract.
6. Run the real `auto-editing-0` example through Gate A and request approval.
7. After approval, produce Gate B/C evidence and request Gate D.
8. Render, inspect, replace previews, scan the repository, and publish only after final verification.
