# Usage

## Install as an Agent Skill

Clone the repository, install dependencies, and link or copy the repository directory into your Agent Skills directory. The entrypoint is `SKILL.md`.

```bash
git clone https://github.com/zhouyuechuan2025-ui/ai-self-media-video-packaging-skill.git
cd ai-self-media-video-packaging-skill
npm ci
```

Example trigger:

> Use package-talking-head-video to inspect this MP4 and SRT, prepare Gate A, and wait for my approval before rendering.

## Inputs

- one existing video file;
- one UTF-8 SRT file;
- caption mode: `burned-in`, `none`, or `generated`;
- renderer: `remotion` or `hyperframes`;
- an output directory that is safe to write.

## Gate A only

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in
```

Outputs:

- `BRIEF.md`
- `SOURCE_PROBE.json`
- `STORYBOARD.md`
- `storyboard.json`
- `input-manifest.json`

## Approved Remotion render

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer remotion --captions burned-in --approve-gate-a --render
```

The renderer creates an H.264/AAC browser proxy only when needed, keeps the source timeline continuous, renders the packaged MP4, extracts five frames, performs a full decode, and writes `RENDER_MANIFEST.json`.

## HyperFrames project

```bash
npm run package-video -- --video ./input.mp4 --srt ./input.srt --out ./run --renderer hyperframes --captions burned-in --approve-gate-a
```

This creates `hyperframes/index.html` and `hyperframes/index.motion.json` from the same storyboard. Validate it with the pinned optional CLI:

```bash
npx hyperframes@0.7.99 lint ./run/hyperframes
npx hyperframes@0.7.99 check ./run/hyperframes --snapshots
```

## Caption modes

- `burned-in`: the source already contains subtitles; no new caption track is rendered.
- `none`: no subtitles are wanted.
- `generated`: a caption layer is rendered from the supplied SRT.

## Evidence assets

Add an evidence object to a storyboard beat only when the source image exists and can be redistributed or used locally:

```json
{
  "evidence": {
    "src": "evidence/product-doc.png",
    "label": "Official product documentation",
    "sourceUrl": "https://example.com/official-doc"
  }
}
```

An illustration is explanatory, not evidentiary. Do not use a drawing, generic icon, or animated counter as proof.
