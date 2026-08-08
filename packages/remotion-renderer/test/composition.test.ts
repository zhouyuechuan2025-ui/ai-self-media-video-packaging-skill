import {describe, expect, it} from 'vitest';
import {buildCompositionPlan} from '../src/VideoPackaging';
import type {Storyboard} from '../../core/src/schema';

const storyboard: Storyboard = {
  version: '1.0', id: 'composition-test', title: 'Composition test', duration: 4, fps: 30, width: 1920, height: 1080,
  captionsMode: 'burned-in', source: {video: 'input.mp4', srt: 'input.srt'}, theme: {background: '#07101f', foreground: '#f8fafc', accent: '#5eead4'},
  beats: [{id: 'b1', start: .5, end: 2.5, text: '测试结构', structure: 'impact-question', motions: ['hit'], placement: 'center'}],
};

describe('VideoPackaging composition plan', () => {
  it('keeps one continuous source track and does not duplicate burned-in captions', () => {
    const plan = buildCompositionPlan({storyboard, overlayOnly: false});
    expect(plan.videoTracks).toEqual([{src: 'input.mp4', from: 0, durationInFrames: 120, audio: true}]);
    expect(plan.captionTracks).toEqual([]);
    expect(plan.overlays[0]).toMatchObject({from: 15, durationInFrames: 60, safeZone: 'center'});
  });

  it('supports a transparent overlay-only render without source media', () => {
    const plan = buildCompositionPlan({storyboard, overlayOnly: true});
    expect(plan.videoTracks).toEqual([]);
    expect(plan.background).toBe('transparent');
  });
});
