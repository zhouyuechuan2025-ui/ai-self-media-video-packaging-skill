import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const skill = readFileSync('SKILL.md', 'utf8');

describe('public Skill contract', () => {
  it('contains every pressure-tested safety boundary', () => {
    for (const phrase of ['Gate A', 'burned-in', 'evidence', 'frame-driven', 'component gallery', 'line illustrations', 'Present the plan first', 'Do not continue until']) {
      expect(skill).toContain(phrase);
    }
  });

  it('keeps the trigger-only frontmatter concise', () => {
    expect(skill).toMatch(/^---\nname: package-talking-head-video\ndescription: Use when /);
  });

  it('teaches the multicolor center-presenter layout and approval contract', () => {
    const normalized = skill.toLowerCase();
    for (const phrase of [
      'center-presenter',
      'left/right lanes',
      'bottom 18%',
      'full-screen',
      '1-2 seconds',
      'semantic palettes',
      'programmatic line illustrations',
      'Do not continue until the user approves',
    ]) {
      expect(normalized).toContain(phrase.toLowerCase());
    }
  });
});
