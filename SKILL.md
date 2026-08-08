---
name: package-talking-head-video
description: Use when packaging center-presenter talking-head content from SRT, optionally with source video, into time-aligned motion graphics or a transparent overlay.
---

# Package Talking-Head Video

Turn center-presenter talking-head content plus SRT into a reproducible, semantically directed packaging project. Accept either SRT-only transparent-overlay output or video-plus-SRT composite output. Preserve the source edit, voice, and burned-in captions unless the user explicitly requests otherwise.

## Required workflow

1. Parse and hash the SRT, then probe and hash the video when supplied. For SRT-only overlay output, lock width, height, fps, and duration from the cues before writing Gate A documents. Gate A is analysis only.
2. Present the plan first. Do not continue until the user approves this exact job. Silence, urgency, another job's approval, or broad permission is not approval.
3. After explicit Gate A approval, build the composition inputs at Gate B. Use Remotion by default; use the HyperFrames adapter only when requested.
4. After Gate B approval, generate eight representative review stills and a contact sheet at Gate C. Do not render the final video.
5. After explicit Gate D approval, render and verify the actual artifact with ffprobe, full decode, eight representative frames, hashes, and a manifest. Composite MP4 requires black-frame detection; transparent MOV requires ProRes 4444, no audio track, an alpha-capable pixel format, and sampled alpha variation.

## Choose the output mode

- Default to `--output-mode composite` for first-time users. Require both video and SRT, review the real presenter and burned-in subtitles, and output `packaged.mp4`.
- Use `--output-mode overlay` when the user wants a ProRes 4444 Alpha `overlay.mov`. Video is optional, but SRT, width, height, and fps must describe the target edit exactly. Warn that SRT-only mode cannot inspect the real face position or subtitle height.

## Four cumulative commands

```bash
# Gate A: plan only
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --output-mode composite

# Gate B: composition inputs
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --output-mode composite --approve-gate-a --approve-gate-b

# Gate C: review stills and contact sheet, no final MP4
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --output-mode composite --approve-gate-a --approve-gate-b --approve-gate-c

# Gate D: final render and artifact QA
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --output-mode composite --approve-gate-a --approve-gate-b --approve-gate-c --approve-gate-d --render

# SRT-only transparent ProRes 4444 overlay
npm run package-video -- --srt INPUT.srt --out RUN --renderer remotion --captions burned-in --output-mode overlay --width 1920 --height 1080 --fps 30 --approve-gate-a --approve-gate-b --approve-gate-c --approve-gate-d --render
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
- Every scene must be either presenter-safe or opaque full-screen. There is no translucent hybrid mode.
- Presenter-safe scenes keep center x=35%–65% completely untouched by foreground surfaces, text, diagrams, paths, glows, or illustrations. If any meaningful element must enter the center, switch to a fully opaque full-screen scene; never partially cover the face.
- Side cards are content-fit: no fixed vertical fill, no decorative empty lower half, and no card taller than 64% of the frame. Prefer one compact rail over two sparse rails when the spoken content does not support two groups.
- Opaque full-screen scenes cover the complete 1920×1080 canvas with an opaque base. Keep critical copy above the caption reserve even when the source captions are hidden by the full-screen scene.
- Semantic palettes support structure; color alone never counts as a new layout.
- If captions are burned in, use `burned-in` and do not generate a second caption layer.
- Visual beats normally last 1.6–3.2 seconds and never exceed six seconds.
- Evidence panels require an actual source asset and readable label. Never invent metrics, logos, testimonials, or product capabilities.
- Every animation is frame-driven and seek-safe. No timers, random values, stateful CSS transitions, or poster-only tricks.
- Programmatic line illustrations must be integrated into the semantic layout, use explicit SVG `fill="none"`, and communicate subject, action, and outcome. They never prove a claim.
- Videos longer than 30 seconds require at least eight semantically valid structures; the same structure may not appear more than twice consecutively.
- Alternate ordinary left/right lanes. Do not place two ordinary overlays on the same side consecutively.
- A component gallery, HTML page, successful build, or mockup is not a delivered video. Verify the real output artifact.
- Gate C screenshots are taken at 72% of each selected beat so the layout is readable after entry motion. Perform manual frame review for face safety, card density, clipping, contrast, semantic fit, and subtitle clearance. Any failed item blocks Gate D.

Read only the reference needed for the current step:

- Gate contract: [references/gates.md](references/gates.md)
- Director and evidence rules: [references/director-rules.md](references/director-rules.md)
- Ten semantic structures: [references/visual-structures.md](references/visual-structures.md)
- Motion and integrated doodles: [references/motion-and-illustration.md](references/motion-and-illustration.md)
- QA and troubleshooting: [references/qa-and-troubleshooting.md](references/qa-and-troubleshooting.md)
- Blocking visual QA: [references/visual-quality-gates.md](references/visual-quality-gates.md)
