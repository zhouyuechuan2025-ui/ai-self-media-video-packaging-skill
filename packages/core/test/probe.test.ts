import {execFileSync} from 'node:child_process';
import {mkdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {probeMedia} from '../src/probe';

const directory = resolve('tests/tmp/probe');
const fixture = resolve(directory, 'fixture.mp4');

beforeAll(() => {
  mkdirSync(directory, {recursive: true});
  execFileSync('ffmpeg', [
    '-y', '-f', 'lavfi', '-i', 'color=c=0x14213d:s=320x180:r=30:d=2',
    '-f', 'lavfi', '-i', 'sine=frequency=440:duration=2',
    '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', fixture,
  ], {stdio: 'ignore'});
});

afterAll(() => rmSync(directory, {recursive: true, force: true}));

describe('probeMedia', () => {
  it('returns normalized video and audio metadata without shell interpolation', () => {
    const result = probeMedia(fixture);
    expect(result.duration).toBeCloseTo(2, 1);
    expect(result.video).toMatchObject({codec: 'h264', width: 320, height: 180, fps: 30});
    expect(result.audio).toMatchObject({codec: 'aac', channels: 1});
    expect(result.size).toBeGreaterThan(1000);
  });
});
