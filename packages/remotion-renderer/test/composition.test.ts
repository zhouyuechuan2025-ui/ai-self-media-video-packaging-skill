import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import type {Storyboard} from '../../core/src/schema';
import {buildCompositionPlan} from '../src/VideoPackaging';

const storyboard: Storyboard = {
  version: '2.0',
  id: 'composition-test',
  title: 'Composition test',
  duration: 4,
  fps: 30,
  width: 1920,
  height: 1080,
  captionsMode: 'burned-in',
  source: {video: 'input.mp4', srt: 'input.srt'},
  theme: {background: '#07101f', foreground: '#f8fafc', accent: '#5eead4'},
  beats: [{
    id: 'b1',
    start: .5,
    end: 2.5,
    text: '测试结构',
    structure: 'thesis-and-proof',
    content: {structure: 'thesis-and-proof', thesis: '核心观点', reason: '用事实支撑'},
    motions: ['hit'],
    placement: 'full',
    palette: 'deep-ocean',
    directorRole: 'hook',
  }],
};

describe('VideoPackaging composition plan', () => {
  it('keeps one continuous source track and does not duplicate burned-in captions', () => {
    const plan = buildCompositionPlan({storyboard, overlayOnly: false});
    expect(plan.videoTracks).toEqual([{src: 'input.mp4', from: 0, durationInFrames: 120, audio: true}]);
    expect(plan.captionTracks).toEqual([]);
    expect(plan.overlays[0]).toMatchObject({from: 15, durationInFrames: 60, safeZone: 'side', palette: 'deep-ocean'});
  });

  it('supports a transparent overlay-only render without source media', () => {
    const plan = buildCompositionPlan({storyboard, overlayOnly: true});
    expect(plan.videoTracks).toEqual([]);
    expect(plan.background).toBe('transparent');
  });

  it('uses the recommended media component for the continuous talking-head track', () => {
    const source = readFileSync('packages/remotion-renderer/src/VideoPackaging.tsx', 'utf8');
    expect(source).toContain("import {Video} from '@remotion/media'");
    expect(source).not.toContain('<OffthreadVideo');
    expect(source).toContain('disallowFallbackToOffthreadVideo');
  });

  it('passes typed content into structures and removes the detached illustration card', () => {
    const source = readFileSync('packages/remotion-renderer/src/VideoPackaging.tsx', 'utf8');
    expect(source).toContain('content={beat.content}');
    expect(source).not.toContain('data-illustration-lane');
  });
});
