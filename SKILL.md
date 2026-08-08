---
name: package-talking-head-video
description: Use when packaging an existing talking-head video from MP4 and SRT into polished, time-aligned motion graphics with Remotion by default or HyperFrames as an optional adapter.
---

# Package Talking-Head Video

Turn an existing video and SRT into a reproducible visual-packaging project. Keep the source edit, voice, and burned-in captions intact unless the user explicitly requests otherwise.

## Required workflow

1. Inspect the source with `ffprobe`, hash both inputs, parse every SRT cue, and create Gate A documents. Do not render at Gate A.
2. Present the plan first and wait for the user to confirm it. Do not continue until that same job receives explicit Gate A approval; silence, a prior job's approval, or general permission is not approval.
3. Review factual claims, caption mode, visual density, safe zones, and evidence needs. Never turn an estimate into an objective fact.
4. After explicit Gate A approval, generate the storyboard and renderer project. Use Remotion by default; use the HyperFrames adapter only when requested.
5. After visual approval, render. Verify the actual artifact with ffprobe, full decode, representative frames, and the generated manifest.

## Command

```bash
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out OUTPUT_DIR --renderer remotion --captions burned-in
```

That command stops after Gate A. To render after approval:

```bash
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out OUTPUT_DIR --renderer remotion --captions burned-in --approve-gate-a --render
```

## Non-negotiable rules

- One continuous source video/audio track; do not silently recut or reorder it.
- If captions are already burned in, use `burned-in` and do not add a second caption track.
- Visual beats should normally be 1.6–3.2 seconds and never exceed six seconds.
- Evidence cards require an actual source asset and label. No invented metrics, logos, testimonials, or product capabilities.
- Every animation must be frame-driven and seek-safe. No timers, CSS transition state, random motion, or poster-only tricks.
- Programmatic line illustrations may clarify an abstract mechanism, comparison, route, workload, speed, or tradeoff; they must not pretend to be evidence.
- A component gallery, HTML preview, or successful build is not a delivered video. Verify the rendered file itself.

Read only the reference needed for the current step:

- Gate contract: [references/gates.md](references/gates.md)
- Director and evidence rules: [references/director-rules.md](references/director-rules.md)
- 18 visual structures: [references/visual-structures.md](references/visual-structures.md)
- Motion and line illustrations: [references/motion-and-illustration.md](references/motion-and-illustration.md)
- QA and troubleshooting: [references/qa-and-troubleshooting.md](references/qa-and-troubleshooting.md)
