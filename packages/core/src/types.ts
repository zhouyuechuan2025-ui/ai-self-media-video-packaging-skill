export type SrtCue = {
  index: number;
  start: number;
  end: number;
  text: string;
};

export type MediaProbe = {
  duration: number;
  size: number;
  video: {codec: string; width: number; height: number; fps: number};
  audio: {codec: string; sampleRate: number; channels: number} | null;
};
