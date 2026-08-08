import {describe, expect, it} from 'vitest';
import {scanEntries} from '../scripts/verify-public-repo.mjs';

describe('public repository verifier', () => {
  it('rejects secrets, private paths, hidden-workbench terms, and source media', () => {
    const findings = scanEntries([
      {path: '.env', size: 10, text: 'TOKEN=test'},
      {path: 'note.md', size: 20, text: ['C:', 'Users', 'Admin', 'secret'].join('\\') + ' and ' + ['D:', 'private'].join('\\')},
      {path: 'private.md', size: 20, text: ['Motion', 'Playground'].join(' ')},
      {path: 'source.mp4', size: 20, text: null},
    ]);
    expect(findings.join('\n')).toContain('.env');
    expect(findings.join('\n')).toContain('absolute-local-path');
    expect(findings.join('\n')).toContain('non-public-term');
    expect(findings.join('\n')).toContain('source-media');
  });

  it('allows generic source, synthetic SRT fixtures, and approved preview images', () => {
    expect(scanEntries([
      {path: 'SKILL.md', size: 100, text: 'Use when packaging video.'},
      {path: 'tests/fixtures/basic.srt', size: 100, text: '1\n00:00:00,000 --> 00:00:01,000\nTest'},
      {path: 'docs/assets/previews/example.png', size: 1000, text: null},
    ])).toEqual([]);
  });
});
