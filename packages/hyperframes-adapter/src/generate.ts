import type {Storyboard} from '../../core/src/schema';
import {beatMarkup, escapeHtml, sharedCss} from './templates';

export type HyperFramesMotionSidecar = {
  duration: number;
  assertions: Array<
    | {kind: 'appearsBy'; selector: string; bySec: number}
    | {kind: 'staysInFrame'; selector: string}
  >;
};

export const generateHyperFramesProject = (storyboard: Storyboard): {html: string; motion: HyperFramesMotionSidecar} => {
  const beats = storyboard.beats.map(beatMarkup).join('\n');
  const timeline = storyboard.beats.map((beat) => {
    const selector = `#beat-${beat.id}-motion`;
    const start = Number(beat.start.toFixed(3));
    const hold = Math.max(.1, Number((beat.end - beat.start - .32).toFixed(3)));
    return `timeline.set(${JSON.stringify(selector)},{opacity:0,y:30},${start}).to(${JSON.stringify(selector)},{opacity:1,y:0,duration:.18},${start}).to(${JSON.stringify(`${selector} .beat__rail`)},{width:'90%',duration:${hold},ease:'none'},${start}).to(${JSON.stringify(selector)},{opacity:0,y:-18,duration:.14},${Number((beat.end - .14).toFixed(3))}).set(${JSON.stringify(selector)},{opacity:0},${Number(beat.end.toFixed(3))});`;
  }).join('\n');
  const motion: HyperFramesMotionSidecar = {
    duration: storyboard.duration,
    assertions: storyboard.beats.flatMap((beat) => [
      {kind: 'appearsBy' as const, selector: `#beat-${beat.id}-motion`, bySec: Number((beat.start + .18).toFixed(3))},
      {kind: 'staysInFrame' as const, selector: `#beat-${beat.id}-motion`},
    ]),
  };
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(storyboard.title)}</title><style>${sharedCss}:root{--bg:${storyboard.theme.background};--fg:${storyboard.theme.foreground};--accent:${storyboard.theme.accent}}</style></head><body><main class="stage clip" data-composition-id="main" data-width="${storyboard.width}" data-height="${storyboard.height}" data-start="0" data-duration="${storyboard.duration}" data-fps="${storyboard.fps}"><video id="source-video" class="source" src="${escapeHtml(storyboard.source.video)}" data-start="0" data-duration="${storyboard.duration}" data-has-audio="true" playsinline></video><div class="overlay">${beats}</div></main><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><script>window.__timelines=window.__timelines||{};const timeline=gsap.timeline({paused:true});${timeline}window.__timelines.main=timeline;</script></body></html>`;
  return {html, motion};
};
