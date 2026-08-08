import {describe, expect, it} from 'vitest';
import type {Storyboard} from '../../core/src/schema';
import {generateHyperFramesProject} from '../src/generate';

const storyboard: Storyboard = {
  version: '1.0', id: 'hf-test', title: 'HF test', duration: 4, fps: 30, width: 1920, height: 1080,
  captionsMode: 'burned-in', source: {video: 'input.mp4'}, theme: {background: '#07101f', foreground: '#f8fafc', accent: '#5eead4'},
  beats: [{id: 'b1', start: .4, end: 2.4, text: '测试时间线', structure: 'signal-route', motions: ['route'], placement: 'left', palette: 'teal-signal', directorRole: 'mechanism'}],
};

describe('generateHyperFramesProject', () => {
  it('emits continuous source media and one paused seek-safe timeline', () => {
    const result = generateHyperFramesProject(storyboard);
    expect(result.html).toContain('<video');
    expect(result.html).toContain('data-composition-id="main"');
    expect(result.html).toContain('data-width="1920"');
    expect(result.html).toContain('data-height="1080"');
    expect(result.html).toContain('data-composition-id="main"');
    expect(result.html).toContain('data-start="0"');
    expect(result.html).toContain('<video id="source-video"');
    expect(result.html).toContain('data-has-audio="true"');
    expect(result.html).toContain('class="stage clip"');
    expect(result.html).toContain('class="beat clip beat--signal-route"');
    expect(result.html).toContain('data-presenter-safe-center="35-65"');
    expect(result.html).toContain('data-palette="teal-signal"');
    expect(result.html).toContain('--beat-canvas:#071b22');
    expect(result.html).toContain('--beat-accent:#54f2d2');
    expect(result.html).toContain('data-placement="left"');
    expect(result.html).toContain('id="beat-b1-motion" class="beat__motion"');
    expect(result.html).toContain('timeline.set("#beat-b1-motion"');
    expect(result.motion.assertions[0]?.selector).toBe('#beat-b1-motion');
    expect(result.html).toContain('data-start="0"');
    expect(result.html).toContain('data-duration="4"');
    expect(result.html).toContain('gsap.timeline({paused:true})');
    expect(result.html).toContain('window.__timelines.main');
    expect(result.html).toContain('0.4');
    expect(result.motion.duration).toBe(4);
    expect(result.motion.assertions).toHaveLength(2);
    expect(result.motion.assertions[0]).toEqual({kind: 'appearsBy', selector: '#beat-b1-motion', bySec: .58});
  });
});
