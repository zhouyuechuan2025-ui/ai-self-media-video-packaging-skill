# Usage

## Install

```bash
git clone https://github.com/zhouyuechuan2025-ui/ai-self-media-video-packaging-skill.git
cd ai-self-media-video-packaging-skill
npm ci
```

Requirements: Node.js 20+, FFmpeg, and ffprobe. The Agent Skill entrypoint is `SKILL.md`.

## Inputs

- one existing center-presenter talking-head video;
- one UTF-8 SRT file;
- caption mode: `burned-in`, `none`, or `generated`;
- renderer: `remotion` by default, or `hyperframes` for compatible project output;
- a writable output directory.

The default 16:9 layout protects center x=35%–65%, uses left x=5%–32% and right x=68%–95%, and reserves the bottom 18% for source captions.

## Gate A — plan only

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in
```

Outputs: `BRIEF.md`, `SOURCE_PROBE.json`, `STORYBOARD.md`, `storyboard.json`, and `input-manifest.json`. Review and approve this exact plan before continuing.

## Gate B — build composition inputs

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b
```

This may create a continuous H.264/AAC proxy for browser-incompatible codecs. It does not render the final MP4.

## Gate C — visual review

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c
```

This generates eight review stills and a contact sheet from eight distinct semantic structures. It does not render the final MP4.

## Gate D — final render

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in --approve-gate-a --approve-gate-b --approve-gate-c --approve-gate-d --render
```

Gate D renders H.264/AAC, performs full decode and black-frame checks, extracts eight representative frames, builds a contact sheet, and writes `RENDER_MANIFEST.json`.

## Optional HyperFrames output

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer hyperframes --captions burned-in --approve-gate-a --approve-gate-b
npx hyperframes@0.7.99 lint ./run/hyperframes
npx hyperframes@0.7.99 check ./run/hyperframes --snapshots
```

The adapter preserves the same ten semantic identifiers and seek-safe absolute timeline. Gate C review stills and Gate D rendering use the default Remotion path.

## Caption modes

- `burned-in`: keep existing source captions and generate no duplicate layer.
- `none`: render no caption layer.
- `generated`: render captions from the SRT.

## Evidence

Only use `evidence-panel` when an approved image exists. Include `src`, `label`, and optional `sourceUrl`. If the source is missing, use `thesis-and-proof` and keep the statement attributed. A semantic doodle is explanatory, never evidentiary.
