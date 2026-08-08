import type {Storyboard} from './schema';
import type {MediaProbe, SrtCue} from './types';

export const gateABrief = ({storyboard, probe, cues}: {storyboard: Storyboard; probe: MediaProbe; cues: SrtCue[]}): string => `# Gate A Brief

- Example: ${storyboard.id}
- Title: ${storyboard.title}
- Source duration: ${probe.duration.toFixed(3)} seconds
- Source video: ${probe.video.codec}, ${probe.video.width}×${probe.video.height}, ${probe.video.fps.toFixed(3)} fps
- Source audio: ${probe.audio ? `${probe.audio.codec}, ${probe.audio.sampleRate} Hz, ${probe.audio.channels} channels` : 'none'}
- SRT cues: ${cues.length}
- Captions mode: ${storyboard.captionsMode}
- Planned visual beats: ${storyboard.beats.length}
- Maximum visual beat: ${Math.max(...storyboard.beats.map((beat) => beat.end - beat.start)).toFixed(3)} seconds

Gate A is analysis only. Rendering requires the explicit \`--approve-gate-a --render\` flags.
`;

export const storyboardMarkdown = (storyboard: Storyboard): string => `# Storyboard

| ID | Time | Structure | Motion | Placement | Copy |
|---|---:|---|---|---|---|
${storyboard.beats.map((beat) => `| ${beat.id} | ${beat.start.toFixed(3)}–${beat.end.toFixed(3)} | ${beat.structure} | ${beat.motions.join(', ')} | ${beat.placement} | ${beat.text.replaceAll('|', '\\|')} |`).join('\n')}
`;
