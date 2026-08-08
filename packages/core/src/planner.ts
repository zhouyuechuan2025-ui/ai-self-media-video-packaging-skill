import {StoryboardSchema, type Storyboard, type StoryboardBeat} from './schema';
import {chooseIllustration, chooseStructure, fallbackStructure, motionsForStructure} from './semantic-rules';
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

const makeBeat = (cue: SrtCue, index: number, previous?: StoryboardBeat): StoryboardBeat => {
  const text = overlayText(cue.text);
  let structure = index === 0 && !/[?？]|为什么|怎么|如何|到底/.test(text) ? 'three-beat-hook' : chooseStructure(text, index);
  if (structure === previous?.structure) structure = fallbackStructure(index);
  const illustration = chooseIllustration(text);
  return {
    id: `beat-${String(index + 1).padStart(2, '0')}`,
    start: Number(cue.start.toFixed(3)),
    end: Number(cue.end.toFixed(3)),
    text,
    structure,
    motions: motionsForStructure(structure),
    placement: structure.startsWith('evidence-') ? 'full' : index % 2 ? 'right' : 'left',
    ...(illustration ? {illustration: {type: illustration, label: text.slice(0, 18)}} : {}),
  };
};

export const planStoryboard = (input: PlannerInput): Storyboard => {
  if (input.cues.length === 0) throw new Error('At least one SRT cue is required');
  const beats: StoryboardBeat[] = [];
  input.cues.forEach((cue, index) => beats.push(makeBeat(cue, index, beats.at(-1))));
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
