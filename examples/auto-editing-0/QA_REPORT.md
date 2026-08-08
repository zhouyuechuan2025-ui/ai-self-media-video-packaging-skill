# QA report

## Decisive artifact

- Renderer: Remotion.
- Output SHA-256: `60BE56C417FE63EF17F18874A4EE74318D001CD40D7A40BA3312488900B85443`.
- Size: 32,921,365 bytes.
- Duration: 49.322667 seconds.
- Video: H.264, 1920×1080, 30fps.
- Audio: AAC, 48kHz, stereo.

## Checks performed

- Remotion rendered 1,479/1,479 frames.
- Full FFmpeg decode completed without an error.
- Black-frame scan returned no black interval.
- The continuous source picture and audio remain present for the complete timeline.
- The source already contained subtitles; no duplicate caption layer was generated.
- Eight representative frames and an eight-frame contact sheet were extracted from the actual final MP4, not from a component preview.
- The approved plan uses 6 palettes, 8 actual structures, 22 visual beats, 6 left-lane placements, 6 right-lane placements, and 10 short full-screen placements; the longest state is 3.2 seconds.
- Human inspection confirmed that presenter-safe frames leave the complete center 35%–65% lane unobstructed and keep the bottom burned-in captions readable.
- Human inspection confirmed that every structure entering the center lane uses a 100% opaque edge-to-edge full-screen surface; no translucent hybrid covers the presenter.
- Human inspection confirmed that side cards fit their content, remain below the 64% height cap, and do not contain a large empty lower half.
- Verbal metrics such as “几万” remain literal instead of being coerced to `0`.
- The semantic doodle visibly depicts a person pushing a boulder uphill rather than a generic symbol.
- Signal-route nodes and result labels use an opaque full-canvas explanation state instead of partially covering the presenter.
- All eight representative screenshots were sampled at 72% of their beat, after the layout had reached its stable readable state.
- The line illustration uses deterministic SVG paths with explicit `fill="none"`.
- Claims in the source narration remain attributed to the speaker; the renderer adds no invented percentage, testimonial, logo, or performance claim.
- Original MP4 and SRT are absent from the public repository candidate set.

## Reproduction note

The public repository includes the source hashes and the exact repository-relative invocation, but not the copyrighted or person-identifying source files. A user can reproduce the workflow with their own MP4 and SRT using the same command shape.
