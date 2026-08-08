import type {StoryboardBeat} from '../../core/src/schema';
import {PALETTES} from '../../core/src/palettes';

export const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export const beatMarkup = (beat: StoryboardBeat): string => {
  const palette = PALETTES[beat.palette];
  return `<section class="beat clip beat--${beat.structure}" id="beat-${escapeHtml(beat.id)}" data-start="${beat.start}" data-duration="${Number((beat.end - beat.start).toFixed(3))}" data-placement="${beat.placement}" data-palette="${beat.palette}" style="--beat-canvas:${palette.canvas};--beat-surface:${palette.surface};--beat-card:${palette.card};--beat-fg:${palette.foreground};--beat-accent:${palette.accent};--beat-line:${palette.line}">
  <div id="beat-${escapeHtml(beat.id)}-motion" class="beat__motion">
    <div class="beat__kicker">${escapeHtml(beat.kicker ?? beat.structure.replaceAll('-', ' '))}</div>
    <h2>${escapeHtml(beat.text)}</h2>
    <div class="beat__rail"></div>
  </div>
</section>`;
};

export const sharedCss = `
:root{--bg:#07101f;--fg:#f8fafc;--accent:#5eead4}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent;font-family:Inter,system-ui,sans-serif}.stage{position:relative;width:100vw;height:100vh;overflow:hidden}.source{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.overlay{position:absolute;inset:0;pointer-events:none}.beat{position:absolute;top:7%;bottom:18%}.beat[data-placement=left]{left:6%;right:68%}.beat[data-placement=right]{left:68%;right:6%}.beat[data-placement=full]{inset:0}.beat__motion{position:absolute;inset:0;padding:7%;color:var(--beat-fg);opacity:0;transform:translateY(30px);overflow:hidden}.beat:not([data-placement=full]) .beat__motion{background:color-mix(in srgb,var(--beat-surface) 82%,transparent);border-left:8px solid var(--beat-accent)}.beat[data-placement=full] .beat__motion{padding:9%;background:var(--beat-canvas)}.beat__kicker{font-size:1.2vw;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--beat-line)}h2{max-width:88%;font-size:4.2vw;line-height:1.02;letter-spacing:-.05em;margin:9% 0 0}.beat__rail{position:absolute;left:7%;bottom:8%;width:0;height:7px;border-radius:99px;background:linear-gradient(90deg,var(--beat-accent),var(--beat-line))}.beat--gradient-keyword .beat__motion,.beat--keyword-relay .beat__motion,.beat--side-insight-card .beat__motion{background:transparent;border:0}.beat--gradient-keyword h2,.beat--keyword-relay h2{color:var(--beat-accent);font-size:4.8vw}.beat--contrarian-stamp .beat__motion,.beat--state-switch .beat__motion{color:#18181b;background:var(--beat-surface);border-left:10px solid var(--beat-accent)}.beat--signal-route .beat__motion{background:transparent;border:0;border-bottom:8px solid var(--beat-line)}.beat--split-conflict .beat__motion:after,.beat--dual-concept .beat__motion:after,.beat--before-after .beat__motion:after{content:'';position:absolute;left:50%;top:6%;bottom:6%;width:2px;background:var(--beat-accent)}.beat--evidence-pip .beat__motion:after,.beat--evidence-takeover .beat__motion:after{content:'EVIDENCE';position:absolute;right:5%;top:10%;width:28%;height:34%;display:grid;place-items:center;border-radius:20px;background:#f8fafc;color:#0f172a;font-weight:900}.beat--metric-counter h2{font-size:6vw}.beat--completion-rail h2{color:var(--beat-accent)}
`;
