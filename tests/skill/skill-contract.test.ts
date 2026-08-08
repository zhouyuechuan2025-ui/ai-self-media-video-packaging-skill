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
});
