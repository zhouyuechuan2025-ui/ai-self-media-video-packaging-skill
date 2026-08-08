import type {StoryboardBeat} from '../../core/src/schema';

export const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export const beatMarkup = (beat: StoryboardBeat): string => `<section class="beat clip beat--${beat.structure}" id="beat-${escapeHtml(beat.id)}" data-start="${beat.start}" data-duration="${Number((beat.end - beat.start).toFixed(3))}" data-placement="${beat.placement}">
  <div id="beat-${escapeHtml(beat.id)}-motion" class="beat__motion">
    <div class="beat__kicker">${escapeHtml(beat.kicker ?? beat.structure.replaceAll('-', ' '))}</div>
    <h2>${escapeHtml(beat.text)}</h2>
    <div class="beat__rail"></div>
  </div>
</section>`;

export const sharedCss = `
:root{--bg:#07101f;--fg:#f8fafc;--accent:#5eead4}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent;font-family:Inter,system-ui,sans-serif}.stage{position:relative;width:100vw;height:100vh;overflow:hidden}.source{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.overlay{position:absolute;inset:0;pointer-events:none}.beat{position:absolute;left:6%;right:6%;top:8%;bottom:14%}.beat[data-placement=left]{right:42%}.beat[data-placement=right]{left:42%}.beat__motion{position:absolute;inset:0;padding:5%;border:1px solid #94a3b844;border-radius:36px;background:linear-gradient(135deg,#07101ff2,#12233ae6);color:var(--fg);opacity:0;transform:translateY(30px);overflow:hidden}.beat__kicker{font-size:1.2vw;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--accent)}h2{max-width:75%;font-size:4.6vw;line-height:1.06;letter-spacing:-.04em;margin:7% 0 0}.beat__rail{position:absolute;left:5%;bottom:8%;width:0;height:6px;border-radius:99px;background:var(--accent)}.beat--split-conflict .beat__motion:after,.beat--dual-concept .beat__motion:after,.beat--before-after .beat__motion:after{content:'';position:absolute;left:50%;top:6%;bottom:6%;width:2px;background:var(--accent)}.beat--evidence-pip .beat__motion:after,.beat--evidence-takeover .beat__motion:after{content:'EVIDENCE';position:absolute;right:5%;top:10%;width:28%;height:34%;display:grid;place-items:center;border-radius:20px;background:#f8fafc;color:#0f172a;font-weight:900}.beat--metric-counter h2{font-size:6vw}.beat--completion-rail{text-align:center}.beat--completion-rail h2{margin-left:auto;margin-right:auto}
`;
