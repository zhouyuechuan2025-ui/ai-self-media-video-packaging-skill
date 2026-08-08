import type {SrtCue} from './types';

const timePattern = /^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/;

const parseTimestamp = (value: string): number => {
  const match = timePattern.exec(value.trim());
  if (!match) throw new Error(`Invalid SRT timestamp: ${value}`);
  const [, hours, minutes, seconds, milliseconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(milliseconds) / 1000;
};

export const parseSrt = (input: string): SrtCue[] => {
  const normalized = input.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const cues = normalized.split(/\n{2,}/).map((block, position) => {
    const lines = block.split('\n');
    const declaredIndex = Number(lines.shift());
    const timing = lines.shift();
    if (!Number.isInteger(declaredIndex) || !timing) {
      throw new Error(`Invalid SRT cue at block ${position + 1}`);
    }
    const range = timing.split(/\s+-->\s+/);
    if (range.length !== 2) throw new Error(`Invalid SRT timestamp range: ${timing}`);
    const start = parseTimestamp(range[0]);
    const end = parseTimestamp(range[1]);
    if (end <= start) throw new Error(`SRT cue end must be after start: ${timing}`);
    const text = lines.join('\n').trim();
    if (!text) throw new Error(`SRT cue ${declaredIndex} has no text`);
    return {index: declaredIndex, start, end, text};
  });

  return cues.sort((a, b) => a.start - b.start || a.end - b.end || a.index - b.index);
};
