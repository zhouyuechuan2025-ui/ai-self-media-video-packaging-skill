# QA report

## Decisive artifact

- Renderer: Remotion.
- Output SHA-256: `57D909FAABE95A68862C0418A4E110EC9BD557B79D3FDEE07FC0545C847679A8`.
- Size: 38,520,178 bytes.
- Duration: 49.322667 seconds.
- Video: H.264, 1920×1080, 30fps.
- Audio: AAC, 48kHz, stereo.

## Checks performed

- Full FFmpeg decode completed without an error.
- Black-frame scan returned no black interval.
- The continuous source picture and audio remain present for the complete timeline.
- The source already contained subtitles; no duplicate caption layer was generated.
- Six representative frames and a ten-frame contact sheet were extracted from the actual final MP4, not from a component preview.
- The approved plan uses 6 palettes, 13 structures, 21 visual beats, 9 left-lane placements, 8 right-lane placements, and 4 short full-screen placements.
- Human inspection confirmed that the center presenter and bottom burned-in captions remain readable in the final contact sheet.
- Remotion rendered 1,479/1,479 frames after the media component and default concurrency were hardened for long-form source playback.
- The line illustration uses deterministic SVG paths with explicit `fill="none"`.
- Claims in the source narration remain attributed to the speaker; the renderer adds no invented percentage, testimonial, logo, or performance claim.
- Original MP4 and SRT are absent from the public repository candidate set.

## Reproduction note

The public repository includes the source hashes and the exact repository-relative invocation, but not the copyrighted/person-identifying source files. A user can reproduce the workflow with their own MP4 and SRT using the same command shape.
