import {existsSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {Storyboard} from '../packages/core/src/schema';
import {buildContactSheet, decodeEntireFile, detectBlackFrames, extractRepresentativeFrames, parseAlphaSignalStats, probeOutput, selectRepresentativeBeats, writeRenderManifest} from '../scripts/lib/artifact-qa';

const temp = mkdtempSync(join(tmpdir(), 'packaging-artifact-qa-'));
const video = join(temp, 'sample.mp4');

const structures = [
  'editorial-dual-rail', 'thesis-and-proof', 'bidirectional-flow', 'command-palette',
  'four-stage-pipeline', 'before-after-scrub', 'metric-odometer', 'signal-route',
] as const;

const storyboard = {
  duration: 2,
  beats: structures.map((structure, index) => ({
    id: `beat-${index + 1}`,
    start: index * .25,
    end: index * .25 + .25,
    structure,
  })),
} as unknown as Storyboard;

beforeAll(() => {
  const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'color=c=0x2457a7:s=320x180:r=30:d=2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', video], {shell: false, windowsHide: true});
  if (result.status !== 0) throw new Error(result.stderr.toString('utf8'));
});

afterAll(() => rmSync(temp, {recursive: true, force: true}));

describe('artifact-level QA', () => {
  it('parses sampled alpha-plane range evidence', () => {
    expect(parseAlphaSignalStats('lavfi.signalstats.YMIN=256\nlavfi.signalstats.YMAX=3760\nlavfi.signalstats.YMIN=3760\nlavfi.signalstats.YMAX=3760')).toEqual({min: 256, max: 3760, samples: 2});
    expect(() => parseAlphaSignalStats('no signal stats')).toThrow(/alpha/i);
  });

  it('selects eight semantically distinct representative beats', () => {
    const selected = selectRepresentativeBeats(storyboard);
    expect(selected).toHaveLength(8);
    expect(new Set(selected.map((item) => item.structure)).size).toBe(8);
    expect(selected[0].timestamp).toBe(0.18);
  });

  it('probes, decodes, extracts, checks, and builds a contact sheet', () => {
    expect(probeOutput(video).video.width).toBe(320);
    expect(() => decodeEntireFile(video)).not.toThrow();
    expect(detectBlackFrames(video)).toEqual([]);
    const frames = extractRepresentativeFrames(video, storyboard, join(temp, 'frames'));
    expect(frames).toHaveLength(8);
    expect(frames.every((frame) => existsSync(frame.file))).toBe(true);
    const contact = buildContactSheet(frames, join(temp, 'contact-sheet.jpg'));
    expect(existsSync(contact)).toBe(true);
  });

  it('writes a manifest with output and frame hashes', () => {
    const frames = extractRepresentativeFrames(video, storyboard, join(temp, 'manifest-frames'));
    const manifest = writeRenderManifest({output: video, storyboard, frames, target: join(temp, 'RENDER_MANIFEST.json')});
    expect(manifest.output.sha256).toMatch(/^[A-F0-9]{64}$/);
    expect(manifest.frames).toHaveLength(8);
    expect(JSON.parse(readFileSync(join(temp, 'RENDER_MANIFEST.json'), 'utf8')).output.file).toBe('sample.mp4');
  });
});
