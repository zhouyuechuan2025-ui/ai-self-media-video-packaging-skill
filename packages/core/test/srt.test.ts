import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {parseSrt} from '../src/srt';

describe('parseSrt', () => {
  it('parses UTF-8, BOM, period milliseconds, multiline text, and sorts by time', () => {
    const text = readFileSync('tests/fixtures/basic.srt', 'utf8');
    const cues = parseSrt(text);
    expect(cues).toEqual([
      {index: 1, start: 0, end: 2.4, text: '第一条字幕'},
      {index: 2, start: 2.5, end: 4, text: '第二条\n跨行字幕'},
    ]);
  });

  it('rejects malformed and reversed time ranges', () => {
    expect(() => parseSrt('1\n00:00:AA,000 --> 00:00:02,000\n坏字幕')).toThrow(/timestamp/i);
    expect(() => parseSrt('1\n00:00:03,000 --> 00:00:02,000\n倒序')).toThrow(/after start/i);
  });
});
