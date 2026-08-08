import {execFileSync} from 'node:child_process';
import type {MediaProbe} from './types';

type FfprobeStream = {
  codec_type: 'video' | 'audio';
  codec_name?: string;
  width?: number;
  height?: number;
  r_frame_rate?: string;
  sample_rate?: string;
  channels?: number;
};

type FfprobeResult = {
  streams?: FfprobeStream[];
  format?: {duration?: string; size?: string};
};

const parseRate = (rate = '0/1'): number => {
  const [numerator, denominator] = rate.split('/').map(Number);
  return denominator ? numerator / denominator : 0;
};

export const probeMedia = (path: string): MediaProbe => {
  const output = execFileSync(
    'ffprobe',
    [
      '-v', 'error',
      '-show_entries',
      'format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels',
      '-of', 'json',
      '--', path,
    ],
    {encoding: 'utf8', windowsHide: true},
  );
  const result = JSON.parse(output) as FfprobeResult;
  const video = result.streams?.find((stream) => stream.codec_type === 'video');
  const audio = result.streams?.find((stream) => stream.codec_type === 'audio');
  if (!video?.codec_name || !video.width || !video.height) {
    throw new Error(`No decodable video stream found: ${path}`);
  }
  return {
    duration: Number(result.format?.duration ?? 0),
    size: Number(result.format?.size ?? 0),
    video: {
      codec: video.codec_name,
      width: video.width,
      height: video.height,
      fps: parseRate(video.r_frame_rate),
    },
    audio: audio?.codec_name
      ? {
          codec: audio.codec_name,
          sampleRate: Number(audio.sample_rate ?? 0),
          channels: Number(audio.channels ?? 0),
        }
      : null,
  };
};
