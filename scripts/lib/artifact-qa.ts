import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {basename, join, resolve} from 'node:path';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import type {Storyboard} from '../../packages/core/src/schema';
import type {SemanticStructure} from '../../packages/core/src/template-contracts';
import {probeMedia} from '../../packages/core/src/probe';

export type RepresentativeBeat = {
  id: string;
  timestamp: number;
  structure: SemanticStructure;
};

export type FrameEvidence = RepresentativeBeat & {
  file: string;
  sha256: string;
  width: number;
  height: number;
};

const runChecked = (command: string, args: string[]): string => {
  const result = spawnSync(command, args, {stdio: 'pipe', shell: false, windowsHide: true, encoding: 'utf8'});
  if (result.status !== 0) {
    throw new Error(`${command} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
};

const sha256 = (file: string): string => createHash('sha256').update(readFileSync(file)).digest('hex').toUpperCase();

export const probeOutput = (file: string) => probeMedia(file);

export const decodeEntireFile = (file: string): void => {
  runChecked('ffmpeg', ['-v', 'error', '-i', resolve(file), '-f', 'null', '-']);
};

export const detectBlackFrames = (file: string): Array<{start: number; end?: number; duration?: number}> => {
  const output = runChecked('ffmpeg', ['-v', 'info', '-i', resolve(file), '-vf', 'blackdetect=d=0.10:pix_th=0.05', '-an', '-f', 'null', '-']);
  const findings: Array<{start: number; end?: number; duration?: number}> = [];
  for (const match of output.matchAll(/black_start:([0-9.]+)(?:\s+black_end:([0-9.]+)\s+black_duration:([0-9.]+))?/g)) {
    findings.push({
      start: Number(match[1]),
      ...(match[2] ? {end: Number(match[2])} : {}),
      ...(match[3] ? {duration: Number(match[3])} : {}),
    });
  }
  return findings;
};

export const selectRepresentativeBeats = (storyboard: Storyboard): RepresentativeBeat[] => {
  const selected: RepresentativeBeat[] = [];
  const seen = new Set<SemanticStructure>();
  for (const beat of storyboard.beats) {
    if (seen.has(beat.structure)) continue;
    seen.add(beat.structure);
    selected.push({id: beat.id, timestamp: Number(((beat.start + beat.end) / 2).toFixed(3)), structure: beat.structure});
    if (selected.length === 8) break;
  }
  if (selected.length < 8) throw new Error(`Gate C requires eight distinct semantic structures; received ${selected.length}`);
  return selected;
};

export const frameEvidenceFromFile = (beat: RepresentativeBeat, file: string): FrameEvidence => {
  const probe = probeMedia(file);
  return {...beat, file, sha256: sha256(file), width: probe.video.width, height: probe.video.height};
};

export const extractRepresentativeFrames = (file: string, storyboard: Storyboard, targetDir: string): FrameEvidence[] => {
  mkdirSync(targetDir, {recursive: true});
  return selectRepresentativeBeats(storyboard).map((beat, index) => {
    const target = join(targetDir, `${String(index + 1).padStart(2, '0')}-${beat.structure}-${beat.timestamp.toFixed(3)}s.png`);
    runChecked('ffmpeg', ['-y', '-v', 'error', '-ss', String(beat.timestamp), '-i', resolve(file), '-frames:v', '1', target]);
    return frameEvidenceFromFile(beat, target);
  });
};

export const buildContactSheet = (frames: FrameEvidence[], target: string): string => {
  if (frames.length !== 8) throw new Error(`Contact sheet requires exactly eight frames; received ${frames.length}`);
  const inputs = frames.flatMap((frame) => ['-i', resolve(frame.file)]);
  const scales = frames.map((_, index) => `[${index}:v]scale=480:270:force_original_aspect_ratio=decrease,pad=480:270:(ow-iw)/2:(oh-ih)/2:color=0x0b1325[v${index}]`).join(';');
  const filter = `${scales};[v0][v1][v2][v3]hstack=inputs=4[top];[v4][v5][v6][v7]hstack=inputs=4[bottom];[top][bottom]vstack=inputs=2[out]`;
  mkdirSync(resolve(target, '..'), {recursive: true});
  runChecked('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', filter, '-map', '[out]', '-frames:v', '1', '-q:v', '2', resolve(target)]);
  return resolve(target);
};

export const writeRenderManifest = ({output, storyboard, frames, target}: {output: string; storyboard: Storyboard; frames: FrameEvidence[]; target: string}) => {
  const probe = probeOutput(output);
  const manifest = {
    rendererVersion: '2.0',
    output: {file: basename(output), sha256: sha256(output), ...probe},
    storyboard: {id: storyboard.id, duration: storyboard.duration, structures: [...new Set(storyboard.beats.map((beat) => beat.structure))]},
    frames: frames.map((frame) => ({...frame, file: basename(frame.file)})),
    fullDecode: 'pass',
    blackFrames: detectBlackFrames(output),
  };
  writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifest;
};
