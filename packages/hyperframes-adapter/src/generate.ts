import type {Storyboard} from '../../core/src/schema';
import {beatMarkup, escapeHtml, sharedCss} from './templates';

export type HyperFramesMotionSidecar = {
  duration: number;
  assertions: Array<
    | {kind: 'appearsBy'; selector: string; bySec: number}
    | {kind: 'staysInFrame'; selector: string}
  >;
};

const motionForBeat = (beat: Storyboard['beats'][number]): string => {
  const selector = `#beat-${beat.id}-motion`;
  const start = Number(beat.start.toFixed(3));
  const end = Number(beat.end.toFixed(3));
  const hold = Math.max(.1, Number((beat.end - beat.start - .34).toFixed(3)));
  const enterX = beat.placement === 'left' ? -34 : beat.placement === 'right' ? 34 : 0;
  const enterY = beat.placement === 'full' ? 22 : 0;
  return [
    `timeline.set(${JSON.stringify(selector)},{opacity:0,x:${enterX},y:${enterY}},${start})`,
    `.to(${JSON.stringify(selector)},{opacity:1,x:0,y:0,duration:.18},${start})`,
    `.fromTo(${JSON.stringify(`${selector} .motion-primary`)},{opacity:0,y:20},{opacity:1,y:0,duration:.24},${Number((start + .06).toFixed(3))})`,
    `.fromTo(${JSON.stringify(`${selector} .motion-secondary`)},{opacity:0,y:14},{opacity:1,y:0,duration:.22,stagger:.06},${Number((start + .16).toFixed(3))})`,
    `.to(${JSON.stringify(`${selector} .beat__rail`)},{scaleX:1,duration:${hold},ease:'none'},${start})`,
    `.to(${JSON.stringify(selector)},{opacity:0,y:-14,duration:.14},${Number((beat.end - .14).toFixed(3))})`,
    `.set(${JSON.stringify(selector)},{opacity:0},${end});`,
  ].join('');
};

export const generateHyperFramesProject = (storyboard: Storyboard): {html: string; motion: HyperFramesMotionSidecar} => {
  const beats = storyboard.beats.map(beatMarkup).join('\n');
  const timeline = storyboard.beats.map(motionForBeat).join('\n');
  const motion: HyperFramesMotionSidecar = {
    duration: storyboard.duration,
    assertions: storyboard.beats.flatMap((beat) => [
      {kind: 'appearsBy' as const, selector: `#beat-${beat.id}-motion`, bySec: Number((beat.start + .18).toFixed(3))},
      {kind: 'staysInFrame' as const, selector: `#beat-${beat.id}-motion`},
    ]),
  };
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(storyboard.title)}</title><style>${sharedCss}:root{--bg:${storyboard.theme.background};--fg:${storyboard.theme.foreground};--accent:${storyboard.theme.accent}}</style></head><body><main class="stage clip" data-composition-id="main" data-presenter-safe-center="35-65" data-subtitle-safe-bottom="18" data-width="${storyboard.width}" data-height="${storyboard.height}" data-start="0" data-duration="${storyboard.duration}" data-fps="${storyboard.fps}"><video id="source-video" class="source" src="${escapeHtml(storyboard.source.video)}" data-start="0" data-duration="${storyboard.duration}" data-has-audio="true" playsinline></video><div class="overlay">${beats}</div></main><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><script>window.__timelines=window.__timelines||{};const timeline=gsap.timeline({paused:true});${timeline}window.__timelines.main=timeline;</script></body></html>`;
  return {html, motion};
};
