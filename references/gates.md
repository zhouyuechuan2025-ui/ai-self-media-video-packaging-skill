# Gates

## Gate A — source and plan

Write `BRIEF.md`, `SOURCE_PROBE.json`, `STORYBOARD.md`, `storyboard.json`, and `input-manifest.json`. Record hashes, duration, codecs, SRT count, caption mode, planned structures, claims needing evidence, and safe areas. No build, preview, or render.

The plan must be shown to the user before implementation. Stop and wait for explicit approval for this exact job. Do not infer approval from silence, urgency, a broad production permission, or approval given to another video.

## Gate B — visual construction

After explicit Gate A approval, construct the real timeline. Check every beat against the SRT and source footage. A static component sheet may support review but is not Gate C.

## Gate C — interactive or rendered preview

Review the actual continuous video with seek-safe motion. Inspect the opening, at least one middle mechanism/evidence beat, and the ending. Fix overlapping copy, hidden faces, covered burned-in captions, or non-readable motion.

## Gate D — export

Export only after explicit approval. Validate the actual file with ffprobe, full decode, frame extraction, dimensions, duration, audio presence, and hashes. Do not describe an unexported project as delivered.
