import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {SEMANTIC_STRUCTURES} from '../../packages/core/src/template-contracts';

const skill = readFileSync('SKILL.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');

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
      '1.6–3.2 seconds',
      'semantic palettes',
      'programmatic line illustrations',
      'Do not continue until the user approves',
    ]) {
      expect(normalized).toContain(phrase.toLowerCase());
    }
  });

  it('uses bounded local render concurrency for 1080p talking-head footage', () => {
    const packagingScript = readFileSync('scripts/package-video.ts', 'utf8');
    expect(packagingScript).toContain("const renderConcurrency = typeof args.concurrency === 'string' ? args.concurrency : '2'");
    expect(packagingScript).toContain("'--concurrency', renderConcurrency");
  });

  it('defines blocking visual QA for center safety, content density, and real review frames', () => {
    for (const phrase of [
      'presenter-safe or opaque full-screen',
      'content-fit',
      'never partially cover the face',
      '72%',
      'manual frame review',
      'blocks Gate D',
    ]) expect(skill.toLowerCase()).toContain(phrase.toLowerCase());
    expect(skill).toContain('references/visual-quality-gates.md');
  });

  it('documents the ten V2 structures and cumulative four-gate flow', () => {
    for (const name of SEMANTIC_STRUCTURES) expect(skill).toContain(name);
    for (const flag of ['--approve-gate-a', '--approve-gate-b', '--approve-gate-c', '--approve-gate-d']) {
      expect(skill).toContain(flag);
    }
    expect(skill).toContain('35%–65%');
    expect(skill).toContain('bottom 18%');
    expect(skill).toContain('Remotion by default');
    expect(skill).toContain('HyperFrames adapter');
  });

  it('teaches first-time users the two real input and output workflows', () => {
    for (const phrase of [
      '前期素材准备',
      '不处理重读、漏读和气口',
      '视频 + SRT',
      '只提供 SRT',
      '透明 MOV',
      '直接合成 MP4',
      '--output-mode overlay',
      '--output-mode composite',
      '默认推荐',
    ]) expect(readme).toContain(phrase);
  });

  it('explains subtitle choices in plain Chinese instead of editor jargon', () => {
    for (const phrase of [
      '原视频已经带有字幕（字幕已固定在画面中）',
      '原视频没有字幕，希望 Skill 自动生成字幕',
      '原视频没有字幕，并且只需要动效、不需要字幕',
    ]) expect(readme).toContain(phrase);
    expect(readme).not.toContain('已烧录字幕');
    expect(readme).not.toContain('烧录字幕');
  });
});
