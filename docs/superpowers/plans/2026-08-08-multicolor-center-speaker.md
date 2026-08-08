# Multicolor Center-Speaker Packaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homogeneous card shell with a semantic multicolor template system designed for center-presenter talking-head footage, then prove it through a newly rendered Auto Editing 0 real-call case.

**Architecture:** Extend the storyboard with per-beat palette and director-role metadata, enforce layout/diversity rules in the planner and validator, and render six distinct visual families in Remotion. Keep the source video continuous and use a shared palette registry so the renderer, optional adapter, documentation, and QA describe the same public behavior.

**Tech Stack:** TypeScript, React, Remotion, Zod, Vitest, ffmpeg/ffprobe, Markdown, GitHub Actions.

---

## File map

- Create `packages/core/src/palettes.ts`: identifiers, palette records, semantic selection.
- Create `packages/core/src/director-validation.ts`: diversity, adjacency, role, and side-alternation checks.
- Modify `packages/core/src/schema.ts`: add palette and director-role fields.
- Modify `packages/core/src/planner.ts`: assign roles, placements, and palettes deterministically.
- Modify `packages/core/src/semantic-rules.ts`: semantic family and role decisions.
- Modify `packages/remotion-renderer/src/theme.ts`: speaker-safe geometry and palette resolution.
- Create `packages/remotion-renderer/src/structures/families.tsx`: six distinct visual grammars.
- Modify renderer structure registry and `VideoPackaging.tsx`: wire per-beat palettes and safe media placement.
- Modify the optional adapter: expose the same palette and center-safe metadata.
- Modify Skill, README, usage, visual references, real-case storyboard, QA, manifest, and preview assets.

### Task 1: Lock the storyboard and director contract with failing tests

**Files:**
- Modify: `packages/core/test/schema.test.ts`
- Modify: `packages/core/test/planner.test.ts`
- Create: `packages/core/test/director-validation.test.ts`
- Modify: `packages/remotion-renderer/test/composition.test.ts`

- [ ] Add a schema test requiring `palette: 'deep-ocean'` and `directorRole: 'hook'`; reject unsupported values.
- [ ] Run `npx vitest run packages/core/test/schema.test.ts` and confirm RED because the fields do not exist.
- [ ] Extend the planner fixture beyond 30 seconds and assert four palettes, five structures, no `center`, alternating side lanes, and valid full-screen roles.
- [ ] Run `npx vitest run packages/core/test/planner.test.ts` and confirm RED.
- [ ] Add fixtures failing for a repeated structure/palette pair, four uses of one template, repeated side lane, and a full-screen explanation role; add one passing fixture.
- [ ] Run `npx vitest run packages/core/test/director-validation.test.ts` and confirm RED because `validateDirectorPlan` does not exist.
- [ ] Commit with `git commit -m "test: define multicolor center-speaker contract"`.

### Task 2: Add palette, role, layout, and validation primitives

**Files:**
- Create: `packages/core/src/palettes.ts`
- Create: `packages/core/src/director-validation.ts`
- Modify: `packages/core/src/schema.ts`
- Modify: `packages/core/src/semantic-rules.ts`
- Modify: `packages/core/src/planner.ts`

- [ ] Define `PALETTE_IDS`, `PaletteId`, `PALETTES`, and `paletteForRole(role, index)` for deep-ocean, violet-sunset, teal-signal, editorial-cream, acid-action, and paper-sketch.
- [ ] Extend each beat with typed `palette` and `directorRole`; reject `center` for a 16:9 storyboard.
- [ ] Implement `validateDirectorPlan` with structured issues for diversity, repeated pairs, template frequency, repeated sides, and invalid full-screen roles.
- [ ] Update the deterministic planner to assign semantic roles, palettes, alternating sides, and full-screen only for hook, bridge, payoff, CTA, or evidence.
- [ ] Run `npx vitest run packages/core/test/schema.test.ts packages/core/test/planner.test.ts packages/core/test/director-validation.test.ts`; expect GREEN.
- [ ] Commit with `git commit -m "feat: add semantic palette and center-speaker director rules"`.

### Task 3: Replace the universal shell with distinct Remotion families

**Files:**
- Modify: `packages/remotion-renderer/test/structures.test.tsx`
- Modify: `packages/remotion-renderer/test/composition.test.ts`
- Create: `packages/remotion-renderer/src/structures/families.tsx`
- Modify: `packages/remotion-renderer/src/structures/components.tsx`
- Modify: `packages/remotion-renderer/src/structures/index.ts`
- Modify: `packages/remotion-renderer/src/structures/types.ts`
- Modify: `packages/remotion-renderer/src/theme.ts`
- Modify: `packages/remotion-renderer/src/VideoPackaging.tsx`

- [ ] Add RED static-markup tests requiring distinct `impact`, `gradient`, `route`, `editorial`, `completion`, and `supporting` family identifiers.
- [ ] Add RED geometry tests requiring left/right lanes outside x=35%-65% and above the bottom 18% subtitle band.
- [ ] Run `npx vitest run packages/remotion-renderer/test/structures.test.tsx packages/remotion-renderer/test/composition.test.ts`; confirm RED.
- [ ] Implement frame-driven impact question, gradient keyword, signal route, editorial stamp, completion rail, and supporting visual families.
- [ ] Give every SVG route explicit `fill="none"`, stroke, width, linecap, and deterministic progress.
- [ ] Implement speaker-safe geometry; keep `center` legacy-only and never emit it from the planner.
- [ ] Resolve `beat.palette` and place evidence/doodles only in safe lanes or approved full-screen scenes.
- [ ] Run `npx vitest run packages/remotion-renderer/test`; expect GREEN.
- [ ] Commit with `git commit -m "feat: render six multicolor talking-head visual families"`.

### Task 4: Align the optional adapter and public Skill contract

**Files:**
- Modify: `packages/hyperframes-adapter/test/generate.test.ts`
- Modify: `packages/hyperframes-adapter/src/templates.ts`
- Modify: `packages/hyperframes-adapter/src/generate.ts`
- Modify: `tests/skill/skill-contract.test.ts`
- Modify: `tests/skill/scenarios.md`
- Modify: `SKILL.md`
- Modify: `README.md`
- Modify: `docs/USAGE.md`
- Modify: `references/visual-structures.md`
- Modify: `references/motion-and-illustration.md`

- [ ] Add RED adapter assertions for palette variables and `data-presenter-safe-center="35-65"`.
- [ ] Add RED Skill assertions for `center-presenter`, left/right lanes, bottom 18%, full-screen 1-2 seconds, semantic palettes, doodles, and Gate A stop.
- [ ] Run `npx vitest run packages/hyperframes-adapter/test/generate.test.ts tests/skill/skill-contract.test.ts`; confirm RED.
- [ ] Update the optional adapter without creating a second planner.
- [ ] Update public documentation to state the center-presenter contract, full-screen exceptions, palette semantics, repetition limits, evidence boundary, and plan-first approval gate.
- [ ] Run focused adapter, Skill, and README tests; expect GREEN except for real-preview hash changes reserved for Task 5.
- [ ] Commit with `git commit -m "docs: define multicolor center-presenter packaging workflow"`.

### Task 5: Re-run Auto Editing 0 and replace preview evidence

**Files:**
- Private input only: the authorized Auto Editing 0 source video, copied into the ignored case-input directory.
- Private input only: the matching Auto Editing 0 SRT, copied into the ignored case-input directory.
- Modify: `examples/auto-editing-0/storyboard.json`
- Modify: `examples/auto-editing-0/preview-manifest.json`
- Modify: `examples/auto-editing-0/QA_REPORT.md`
- Modify: `examples/auto-editing-0/README.md`
- Replace: `docs/assets/previews/auto-editing-0-*.png`
- Replace: `docs/assets/previews/auto-editing-0-contact-sheet.jpg`
- Modify: `tests/readme-integrity.test.ts`

- [ ] Generate Gate A without rendering; inspect palette count, structure count, sides, full-screen roles, captions, facts, and repetition checks.
- [ ] Use the already approved design to run `npm run example:auto-editing-0` against ignored/private copies of the authorized inputs.
- [ ] Verify the actual MP4 using ffprobe, full ffmpeg decode, duration tolerance, audio presence, and sampled black-frame checks.
- [ ] Manually inspect frames for presenter obstruction, subtitle collision, color/structure repetition, route readability, and doodle integrity.
- [ ] Extract at least six timestamped PNGs and one contact sheet from the actual MP4 only.
- [ ] Recompute output and preview SHA-256 values; update manifest, QA, README, and `tests/readme-integrity.test.ts`.
- [ ] Run `npx vitest run tests/readme-integrity.test.ts`; expect GREEN.
- [ ] Commit with `git commit -m "docs: replace real-call preview with multicolor center-speaker render"`.

### Task 6: Full verification, clean-source audit, and publication

**Files:**
- Modify: `scripts/verify-public-repo.mjs`
- Modify: `SHA256SUMS.txt`
- Modify: `PUBLIC_RELEASE_REPORT.md`

- [ ] Add RED public-audit assertions for the design spec, palette registry, center-presenter wording, preview count, and forbidden private-source/tool wording.
- [ ] Complete the audit, run `npm run checksums`, then `npm run verify:public`; expect `{ok:true}`.
- [ ] Run fresh `npm run verify:all`, `git diff --check`, and `git status --short`.
- [ ] Scan tracked files for `.env`, API keys, tokens, cookies, private keys, browser state, private MP4/SRT paths, source media extensions, and language discussing hidden/private authoring systems.
- [ ] Update release evidence and commit with `git commit -m "chore: verify multicolor public skill release"`.
- [ ] Merge the verified feature branch to `main`, rerun `npm run verify:all`, push `main`, and wait for GitHub Actions.
- [ ] Report the final commit, CI URL, actual-output SHA-256, preview hashes, and any remaining limitations.

## Self-review result

- Spec coverage: every approved visual family, palette, center-safe rule, full-screen exception, real-case preview, and public-source boundary maps to a task.
- Unfinished-marker scan: no incomplete implementation markers remain.
- Type consistency: `palette`, `directorRole`, `PaletteId`, and `validateDirectorPlan` use one name throughout.
- Scope: the plan changes the existing renderer and Skill only; it does not reproduce or describe a separate authoring application.
