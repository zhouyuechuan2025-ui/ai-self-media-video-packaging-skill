import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path));
const sha256 = (value: Buffer) => createHash('sha256').update(value).digest('hex').toUpperCase();

describe('public README evidence', () => {
  it('links only existing local preview assets', () => {
    const markdown = read('README.md').toString('utf8');
    const links = [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
    expect(links.length).toBeGreaterThanOrEqual(7);
    for (const link of links) expect(existsSync(resolve(root, link))).toBe(true);
  });

  it('maps every preview to the verified output and matching file hash', () => {
    const manifest = JSON.parse(read('examples/auto-editing-0/preview-manifest.json').toString('utf8'));
    expect(manifest.output.sha256).toBe('026C197E05B3D3C14323DF04A81F27C6F252E467D8BADC7CA963D02121278C37');
    for (const frame of manifest.frames) {
      const path = resolve(root, 'examples/auto-editing-0', frame.file);
      expect(existsSync(path)).toBe(true);
      expect(sha256(readFileSync(path))).toBe(frame.sha256);
      expect(frame.timeSeconds).toBeGreaterThanOrEqual(0);
      expect(frame.timeSeconds).toBeLessThanOrEqual(manifest.output.durationSeconds);
    }
    const contactSheet = resolve(root, 'examples/auto-editing-0', manifest.contactSheet.file);
    expect(sha256(readFileSync(contactSheet))).toBe(manifest.contactSheet.sha256);
  });

  it('keeps the approved business WeChat as the final non-empty line', () => {
    const lines = read('README.md').toString('utf8').trimEnd().split(/\r?\n/);
    expect(lines.at(-1)).toBe('感兴趣的朋友欢迎咨询业务微信：nanaya093');
  });
});
