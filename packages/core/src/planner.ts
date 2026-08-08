import {buildTemplateContent} from './content-builders';
import {paletteForRole} from './palettes';
import {StoryboardSchema, type Storyboard, type StoryboardBeat} from './schema';
import {chooseDirectorRole, chooseIllustration, classifySemanticStructure, motionsForStructure} from './semantic-rules';
import type {SemanticStructure} from './template-contracts';
import type {MediaProbe, SrtCue} from './types';

type PlannerEvidence = {src: string; label: string; sourceUrl?: string};

type PlannerInput = {
  id: string;
  title: string;
  cues: SrtCue[];
  probe: MediaProbe;
  captionsMode: Storyboard['captionsMode'];
  sourceVideo: string;
  sourceSrt?: string;
  evidenceByCue?: Record<number, PlannerEvidence>;
};

const overlayText = (text: string): string => {
  const compact = text.replace(/\s+/g, ' ').trim();
  return compact.length <= 34 ? compact : `${compact.slice(0, 33)}…`;
};

const choosePlacement = (
  structure: SemanticStructure,
  directorRole: StoryboardBeat['directorRole'],
  lastSide: 'left' | 'right',
): 'left' | 'right' | 'full' => {
  const fullStructures = new Set<SemanticStructure>([
    'four-stage-pipeline',
    'before-after-scrub',
    'evidence-panel',
    'metric-odometer',
    'signal-route',
    'semantic-doodle',
  ]);
  if (directorRole === 'hook' || fullStructures.has(structure)) return 'full';
  return lastSide === 'left' ? 'right' : 'left';
};

const makeBeat = (
  cue: SrtCue,
  index: number,
  lastSide: 'left' | 'right',
  evidence: PlannerEvidence | undefined,
): StoryboardBeat => {
  const text = overlayText(cue.text);
  const classified = classifySemanticStructure(text, index);
  const structure: SemanticStructure = classified === 'evidence-panel' && !evidence
    ? 'thesis-and-proof'
    : classified;
  const illustration = chooseIllustration(text);
  const directorRole = chooseDirectorRole(text, index);
  const content = buildTemplateContent(structure, text, {evidence});
  return {
    id: `beat-${String(index + 1).padStart(2, '0')}`,
    start: Number(cue.start.toFixed(3)),
    end: Number(cue.end.toFixed(3)),
    text,
    structure,
    content,
    motions: motionsForStructure(structure),
    placement: choosePlacement(structure, directorRole, lastSide),
    palette: paletteForRole(directorRole, index, Boolean(illustration)),
    directorRole,
    reason: classified === 'evidence-panel' && !evidence
      ? 'Evidence wording detected but no approved source asset was supplied; downgraded to thesis-and-proof.'
      : `Selected from spoken semantics: ${structure}.`,
    ...(evidence && structure === 'evidence-panel' ? {evidence} : {}),
    ...(illustration ? {illustration: {type: illustration, label: text.slice(0, 18)}} : {}),
  };
};

export const planStoryboard = (input: PlannerInput): Storyboard => {
  if (input.cues.length === 0) throw new Error('At least one SRT cue is required');
  const beats: StoryboardBeat[] = [];
  let lastSide: 'left' | 'right' = 'right';
  input.cues.forEach((cue, index) => {
    const beat = makeBeat(cue, index, lastSide, input.evidenceByCue?.[cue.index]);
    beats.push(beat);
    if (beat.placement === 'left' || beat.placement === 'right') lastSide = beat.placement;
  });
  return StoryboardSchema.parse({
    version: '2.0',
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
