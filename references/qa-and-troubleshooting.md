# QA and troubleshooting

## Required checks

1. `npm test`
2. `npm run typecheck`
3. `npm run build`
4. ffprobe on the source and output
5. full FFmpeg decode of the output
6. representative frame extraction from the actual output
7. duration, dimensions, fps, codec, audio, and SHA-256 comparison
8. `npm run verify:public` before publishing a repository

## Common failures

- **Chromium cannot decode HEVC:** create an H.264/AAC proxy without trimming, reordering, or changing the timeline.
- **Duplicate subtitles:** set `--captions burned-in` when the source already contains them.
- **Blank render:** verify the public directory and `storyboard.source.video` filename match.
- **Motion looks correct only at playback:** seek to arbitrary frames. Remove timers, transitions, and runtime state.
- **Black SVG block:** put `fill="none"` directly on every open SVG path; do not rely only on external CSS.
- **Evidence claim without proof:** downgrade it to an attributed speaker claim or remove the evidence treatment.
- **Build passes but output is wrong:** inspect the rendered artifact. Build status is not visual QA.
