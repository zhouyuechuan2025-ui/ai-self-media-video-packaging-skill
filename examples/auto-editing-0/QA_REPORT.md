# QA report

## Decisive artifact

- Renderer: Remotion.
- Output SHA-256: `30B98D2A68B6204D101DF3752A58C53FFA4641E6BDCE93C1E71C5A2ABF64EB20`.
- Size: 42,279,979 bytes.
- Duration: 49.344 seconds.
- Video: H.264, 1920×1080, 30fps.
- Audio: AAC, 48kHz, stereo.

## Checks performed

- Full FFmpeg decode completed without an error.
- Black-frame scan returned no black interval.
- The continuous source picture and audio remain present for the complete timeline.
- The source already contained subtitles; no duplicate caption layer was generated.
- Six representative frames were extracted from the actual final MP4, not from a component preview.
- The line illustration uses deterministic SVG paths with explicit `fill="none"`.
- Claims in the source narration remain attributed to the speaker; the renderer adds no invented percentage, testimonial, logo, or performance claim.
- Original MP4 and SRT are absent from the public repository candidate set.

## Reproduction note

The public repository includes the source hashes and the exact repository-relative invocation, but not the copyrighted/person-identifying source files. A user can reproduce the workflow with their own MP4 and SRT using the same command shape.
