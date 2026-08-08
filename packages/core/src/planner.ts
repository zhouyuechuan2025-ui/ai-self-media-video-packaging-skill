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
    'bidirectional-flow',
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

const mergeVisualCues = (cues: SrtCue[]): SrtCue[] => {
  const merged: SrtCue[] = [];
  for (let index = 0; index < cues.length; index += 1) {
    const cue = cues[index];
    const next = cues[index + 1];
    const isShortBridge = cue.end - cue.start < .9 && cue.text.trim().length <= 8;
    const isAdjacent = next && next.start - cue.end <= .35;
    if (isShortBridge && isAdjacent) {
      merged.push({...cue, end: next.end, text: `${cue.text.trim()}，${next.text.trim()}`});
      index += 1;
    } else {
      merged.push(cue);
    }
  }
  return merged;
};

const splitLongVisualCue = (cue: SrtCue): SrtCue[] => {
  const duration = cue.end - cue.start;
  if (duration <= 3.2) return [cue];

  const compact = cue.text.replace(/\s+/g, ' ').trim();
  const metric = /\d+(?:\.\d+)?%?|百分之[^，。！？,.!?]*|几万|几十|几个月|万|千|分钟|小时|倍/.exec(compact);
  const connector = /还有|以及|同时/.exec(compact);
  let splitAt = -1;
  let secondPrefix = '';

  if (metric) {
    const beforeMetric = compact.slice(0, metric.index);
    const semanticLead = /(几乎|每条|只需要|只用了|仅用了|进入|达到|提升|下降|消耗)[^，。！？,.!?]*$/.exec(beforeMetric);
    splitAt = semanticLead?.index ?? metric.index;
    secondPrefix = /我|本人|我的|新账号/.test(compact) ? '个人案例：' : '';
  } else if (connector) {
    splitAt = connector.index;
    secondPrefix = '继续分享：';
  } else {
    const punctuation = [...compact.matchAll(/[，。；：,.!?！？]/g)]
      .map((match) => match.index ?? -1)
      .filter((index) => index > 0);
    splitAt = punctuation.sort((left, right) => Math.abs(left - compact.length / 2) - Math.abs(right - compact.length / 2))[0]
      ?? Math.floor(compact.length / 2);
  }

  if (splitAt <= 0 || splitAt >= compact.length - 1) splitAt = Math.floor(compact.length / 2);
  const firstText = compact.slice(0, splitAt).replace(/[，。；：,.!?！？]+$/, '').trim();
  const secondText = compact.slice(splitAt).replace(/^[，。；：,.!?！？]+/, '').trim();
  if (!firstText || !secondText) return [cue];

  const midpoint = Number((cue.start + duration / 2).toFixed(3));
  return [
    {...cue, end: midpoint, text: firstText},
    {...cue, start: midpoint, text: `${secondPrefix}${secondText}`},
  ];
};

export const planStoryboard = (input: PlannerInput): Storyboard => {
  if (input.cues.length === 0) throw new Error('At least one SRT cue is required');
  const beats: StoryboardBeat[] = [];
  let lastSide: 'left' | 'right' = 'right';
  mergeVisualCues(input.cues).flatMap(splitLongVisualCue).forEach((cue, index) => {
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
