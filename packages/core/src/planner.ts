import {StoryboardSchema, type Storyboard, type StoryboardBeat, type VisualStructure} from './schema';
import {paletteForRole} from './palettes';
import {chooseDirectorRole, chooseIllustration, chooseStructure, fallbackStructure, motionsForStructure} from './semantic-rules';
import type {MediaProbe, SrtCue} from './types';

type PlannerInput = {
  id: string;
  title: string;
  cues: SrtCue[];
  probe: MediaProbe;
  captionsMode: Storyboard['captionsMode'];
  sourceVideo: string;
  sourceSrt?: string;
};

const overlayText = (text: string): string => {
  const compact = text.replace(/\s+/g, ' ').trim();
  return compact.length <= 34 ? compact : `${compact.slice(0, 33)}…`;
};

const rotationPool: VisualStructure[] = [
  'gradient-keyword', 'side-insight-card', 'keyword-relay', 'state-switch',
  'chapter-timeline', 'split-conflict', 'dual-concept', 'capability-matrix',
  'adaptive-steps', 'contrarian-stamp',
];

const selectStructure = (
  candidate: VisualStructure,
  index: number,
  previous: StoryboardBeat | undefined,
  counts: Map<VisualStructure, number>,
): VisualStructure => {
  if (candidate !== previous?.structure && (counts.get(candidate) ?? 0) < 3) return candidate;
  const rotated = rotationPool
    .map((structure, offset) => ({structure, offset, count: counts.get(structure) ?? 0}))
    .filter(({structure, count}) => structure !== previous?.structure && count < 3)
    .sort((a, b) => a.count - b.count || ((a.offset - index + rotationPool.length) % rotationPool.length) - ((b.offset - index + rotationPool.length) % rotationPool.length));
  return rotated[0]?.structure ?? fallbackStructure(index);
};

const makeBeat = (
  cue: SrtCue,
  index: number,
  previous: StoryboardBeat | undefined,
  lastSide: 'left' | 'right',
  counts: Map<VisualStructure, number>,
): StoryboardBeat => {
  const text = overlayText(cue.text);
  const candidate = index === 0 && !/[?？]|为什么|怎么|如何|到底/.test(text) ? 'three-beat-hook' : chooseStructure(text, index);
  const structure = selectStructure(candidate, index, previous, counts);
  const illustration = chooseIllustration(text);
  const directorRole = chooseDirectorRole(text, index);
  const fullScreen = directorRole === 'hook'
    || directorRole === 'cta'
    || directorRole === 'payoff'
    || (directorRole === 'evidence' && structure === 'evidence-takeover');
  return {
    id: `beat-${String(index + 1).padStart(2, '0')}`,
    start: Number(cue.start.toFixed(3)),
    end: Number(cue.end.toFixed(3)),
    text,
    structure,
    motions: motionsForStructure(structure),
    placement: fullScreen ? 'full' : lastSide === 'left' ? 'right' : 'left',
    palette: paletteForRole(directorRole, index, Boolean(illustration)),
    directorRole,
    ...(illustration ? {illustration: {type: illustration, label: text.slice(0, 18)}} : {}),
  };
};

export const planStoryboard = (input: PlannerInput): Storyboard => {
  if (input.cues.length === 0) throw new Error('At least one SRT cue is required');
  const beats: StoryboardBeat[] = [];
  let lastSide: 'left' | 'right' = 'right';
  input.cues.forEach((cue, index) => {
    const counts = new Map<VisualStructure, number>();
    beats.forEach((item) => counts.set(item.structure, (counts.get(item.structure) ?? 0) + 1));
    const beat = makeBeat(cue, index, beats.at(-1), lastSide, counts);
    beats.push(beat);
    if (beat.placement === 'left' || beat.placement === 'right') lastSide = beat.placement;
  });
  return StoryboardSchema.parse({
    version: '1.0',
    id: input.id,
    title: input.title,
    duration: Number(input.probe.duration.toFixed(3)),
    fps: Math.round(input.probe.video.fps || 30),
    width: input.probe.video.width,
    height: input.probe.video.height,
    captionsMode: input.captionsMode,
    source: {video: input.sourceVideo, ...(input.sourceSrt ? {srt: input.sourceSrt} : {})},
    theme: {background: '#07111f', foreground: '#f6f8fb', accent: '#5eead4'},
    beats,
  });
};
