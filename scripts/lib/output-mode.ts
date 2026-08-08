import type {Args} from './gates';
import type {MediaProbe, SrtCue} from '../../packages/core/src/types';
import {join} from 'node:path';

export type OutputMode = 'overlay' | 'composite';

export const buildRemotionOutputFlags = (mode: OutputMode): string[] => mode === 'overlay'
  ? ['--codec', 'prores', '--prores-profile', '4444', '--pixel-format', 'yuva444p10le', '--image-format', 'png', '--muted']
  : ['--codec', 'h264', '--crf', '18'];

export const buildOverlaySequenceFlags = (): string[] => [
  '--sequence', '--image-format', 'png', '--image-sequence-pattern', 'frame-[frame].[ext]', '--muted',
];

export const buildOverlayFfmpegArgs = ({sequenceDir, output, fps, totalFrames}: {
  sequenceDir: string;
  output: string;
  fps: number;
  totalFrames: number;
}): string[] => {
  const padLength = Math.max(1, String(Math.max(0, totalFrames - 1)).length);
  return [
    '-y', '-v', 'error', '-framerate', String(fps), '-start_number', '0',
    '-i', join(sequenceDir, `frame-%0${padLength}d.png`), '-an',
    '-c:v', 'prores_ks', '-profile:v', '4', '-pix_fmt', 'yuva444p10le',
    '-threads', '1', '-filter_threads', '1', '-filter_complex_threads', '1',
    output,
  ];
};

export const resolveOutputMode = (args: Args, video?: string): OutputMode => {
  const value = typeof args['output-mode'] === 'string' ? args['output-mode'] : 'composite';
  if (value !== 'overlay' && value !== 'composite') {
    throw new Error('Invalid --output-mode; expected overlay or composite');
  }
  if (value === 'composite' && !video) {
    throw new Error('Composite output requires --video');
  }
  return value;
};

export const syntheticOverlayProbe = ({cues, width, height, fps}: {
  cues: SrtCue[];
  width: number;
  height: number;
  fps: number;
}): MediaProbe => {
  if (!Number.isInteger(width) || width <= 0) throw new Error('Overlay width must be a positive integer');
  if (!Number.isInteger(height) || height <= 0) throw new Error('Overlay height must be a positive integer');
  if (!Number.isFinite(fps) || fps <= 0) throw new Error('Overlay fps must be positive');
  const duration = Math.max(0, ...cues.map((cue) => cue.end));
  if (duration <= 0) throw new Error('SRT must contain at least one positive-duration cue');
  return {
    duration,
    size: 0,
    video: {codec: 'transparent-canvas', width, height, fps},
    audio: null,
  };
};
