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
    expect(manifest.output.sha256).toBe('60BE56C417FE63EF17F18874A4EE74318D001CD40D7A40BA3312488900B85443');
    expect(new Set(manifest.frames.map((frame: {presentationMode: string}) => frame.presentationMode))).toEqual(new Set(['presenter-safe', 'opaque-full-screen']));
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

  it('keeps the approved business WeChat and QR code together at the end', () => {
    const lines = read('README.md').toString('utf8').trimEnd().split(/\r?\n/).filter(Boolean);
    expect(lines.at(-2)).toBe('感兴趣的朋友欢迎咨询业务微信：nanaya093');
    expect(lines.at(-1)).toBe('<img src="docs/assets/contact/nana-wechat-qr.jpg" alt="Nana 业务微信二维码" width="320">');
  });
});
