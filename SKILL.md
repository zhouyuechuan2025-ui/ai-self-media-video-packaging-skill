---
name: package-talking-head-video
description: Use when packaging an existing talking-head video from MP4 and SRT into polished, time-aligned motion graphics with Remotion by default or HyperFrames as an optional adapter.
---

# Package Talking-Head Video

Turn a center-presenter talking-head video plus SRT into a reproducible, semantically directed packaging project. Preserve the source edit, voice, and burned-in captions unless the user explicitly requests otherwise.

## Required workflow

1. Probe and hash both inputs, parse every SRT cue, classify claims and evidence, and write Gate A documents. Gate A is analysis only.
2. Present the plan first. Do not continue until the user approves this exact job. Silence, urgency, another job's approval, or broad permission is not approval.
3. After explicit Gate A approval, build the composition inputs at Gate B. Use Remotion by default; use the HyperFrames adapter only when requested.
4. After Gate B approval, generate eight representative review stills and a contact sheet at Gate C. Do not render the final video.
5. After explicit Gate D approval, render and verify the actual artifact with ffprobe, full decode, black-frame detection, eight representative frames, hashes, and a manifest.

## Four cumulative commands

```bash
# Gate A: plan only
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in

# Gate B: composition inputs
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b

# Gate C: review stills and contact sheet, no final MP4
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c

# Gate D: final render and artifact QA
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c --approve-gate-d --render
```

## V2 semantic structures

Select by spoken meaning, never by palette rotation:

- `editorial-dual-rail`: two-sided facts, categories, or action lists.
- `thesis-and-proof`: one claim plus its reason, attribution, or proof boundary.
- `bidirectional-flow`: input/output, human/AI, or generate/review loops.
- `command-palette`: literal operations, checks, approvals, or run steps.
- `four-stage-pipeline`: three or four ordered production stages.
- `before-after-scrub`: exactly two anchored states and one comparison criterion.
- `evidence-panel`: a real approved screenshot or document plus source and interpretation.
- `metric-odometer`: one to three attributed or source-backed numbers.
- `signal-route`: three to five nodes connected by a traceable path.
- `semantic-doodle`: an integrated subject/action/outcome metaphor, never evidence.

## Non-negotiable visual rules

- Maintain one continuous source video/audio track. Do not silently recut or reorder it.
- For a 16:9 center-presenter source, protect center x=35%–65%. Put ordinary critical copy in left x=5%–32% or right x=68%–95%, and reserve the bottom 18% for burned-in subtitles.
- Full-screen structures must either preserve the presenter window or use an intentional dim layer. Keep critical copy above the caption reserve.
- Semantic palettes support structure; color alone never counts as a new layout.
- If captions are burned in, use `burned-in` and do not generate a second caption layer.
- Visual beats normally last 1.6–3.2 seconds and never exceed six seconds.
- Evidence panels require an actual source asset and readable label. Never invent metrics, logos, testimonials, or product capabilities.
- Every animation is frame-driven and seek-safe. No timers, random values, stateful CSS transitions, or poster-only tricks.
- Programmatic line illustrations must be integrated into the semantic layout, use explicit SVG `fill="none"`, and communicate subject, action, and outcome. They never prove a claim.
- Videos longer than 30 seconds require at least eight semantically valid structures; the same structure may not appear more than twice consecutively.
- Alternate ordinary left/right lanes. Do not place two ordinary overlays on the same side consecutively.
- A component gallery, HTML page, successful build, or mockup is not a delivered video. Verify the real output artifact.

Read only the reference needed for the current step:

- Gate contract: [references/gates.md](references/gates.md)
- Director and evidence rules: [references/director-rules.md](references/director-rules.md)
- Ten semantic structures: [references/visual-structures.md](references/visual-structures.md)
- Motion and integrated doodles: [references/motion-and-illustration.md](references/motion-and-illustration.md)
- QA and troubleshooting: [references/qa-and-troubleshooting.md](references/qa-and-troubleshooting.md)
