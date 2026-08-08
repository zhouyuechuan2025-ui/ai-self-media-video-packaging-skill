import type {StoryboardBeat} from '../../core/src/schema';
import type {SemanticStructure} from '../../core/src/template-contracts';
import {PALETTES} from '../../core/src/palettes';
import {resolvePresentationMode} from '../../core/src/presentation-contracts';

export const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const identities: Record<SemanticStructure, string> = {
  'editorial-dual-rail': 'two-framed-editorial-rails',
  'thesis-and-proof': 'thesis-with-bordered-proof',
  'bidirectional-flow': 'forward-return-loop',
  'command-palette': 'focused-action-console',
  'four-stage-pipeline': 'connected-stage-pipeline',
  'before-after-scrub': 'anchored-state-scrubber',
  'evidence-panel': 'source-first-evidence-takeover',
  'metric-odometer': 'sourced-number-odometer',
  'signal-route': 'node-route-trace',
  'semantic-doodle': 'integrated-action-doodle',
};

export const markupIdentity = (structure: SemanticStructure): string => identities[structure];

const shell = (beat: StoryboardBeat, body: string): string => {
  const palette = PALETTES[beat.palette];
  const presentationMode = resolvePresentationMode(beat.structure, beat.placement);
  return `<section class="beat clip beat--${beat.structure}" id="beat-${escapeHtml(beat.id)}" data-semantic-structure="${beat.structure}" data-markup-identity="${markupIdentity(beat.structure)}" data-presentation-mode="${presentationMode}" data-start="${beat.start}" data-duration="${Number((beat.end - beat.start).toFixed(3))}" data-placement="${beat.placement}" data-palette="${beat.palette}" style="--beat-canvas:${palette.canvas};--beat-surface:${palette.surface};--beat-card:${palette.card};--beat-fg:${palette.foreground};--beat-muted:${palette.muted};--beat-accent:${palette.accent};--beat-line:${palette.line}">
  <div id="beat-${escapeHtml(beat.id)}-motion" class="beat__motion">${body}<div class="beat__rail motion-secondary"></div></div>
</section>`;
};

const listItems = (items: Array<{label: string; detail: string}>): string => items
  .map((item, index) => `<div class="numbered-item motion-secondary"><b>${String(index + 1).padStart(2, '0')}</b><span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></span></div>`)
  .join('');

const renderDualRail = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'editorial-dual-rail') throw new Error('Mismatched dual rail content');
  const content = beat.content;
  return shell(beat, `<div class="dual-rail motion-primary"><aside><em>${escapeHtml(content.kicker)}</em><h2>${escapeHtml(content.headline)}</h2>${listItems(content.leftItems)}</aside><aside>${listItems(content.rightItems)}<mark>${escapeHtml(content.takeaway)}</mark></aside></div>`);
};

const renderThesisProof = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'thesis-and-proof') throw new Error('Mismatched thesis content');
  const content = beat.content;
  return shell(beat, `<div class="thesis-proof motion-primary"><aside><em>CORE THESIS</em><h2>${escapeHtml(content.thesis)}</h2></aside><aside><em>WHY IT HOLDS</em><p>${escapeHtml(content.reason)}</p>${content.sourceLabel ? `<mark>${escapeHtml(content.sourceLabel)}</mark>` : ''}${content.sourceDetail ? `<small>${escapeHtml(content.sourceDetail)}</small>` : ''}</aside></div>`);
};

const renderBidirectionalFlow = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'bidirectional-flow') throw new Error('Mismatched flow content');
  const content = beat.content;
  return shell(beat, `<div class="bidirectional motion-primary"><div class="node node--left"><em>INPUT</em><h3>${escapeHtml(content.leftLabel)}</h3></div><div class="flow-lines"><span>${escapeHtml(content.forwardAction)} →</span><span>← ${escapeHtml(content.returnAction ?? 'Review')}</span></div><div class="node node--right"><em>OUTPUT</em><h3>${escapeHtml(content.rightLabel)}</h3></div><mark>${escapeHtml(content.result)}</mark></div>`);
};

const renderCommandPalette = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'command-palette') throw new Error('Mismatched command content');
  const content = beat.content;
  return shell(beat, `<div class="command-panel motion-primary"><em>COMMAND PALETTE</em><h2>${escapeHtml(content.commandTitle)}</h2><ol>${content.actions.map((action) => `<li class="motion-secondary"><span>⌘</span>${escapeHtml(action)}</li>`).join('')}</ol><mark>${escapeHtml(content.resultState)}</mark></div>`);
};

const renderPipeline = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'four-stage-pipeline') throw new Error('Mismatched pipeline content');
  const content = beat.content;
  return shell(beat, `<div class="pipeline motion-primary"><header><em>OPERATING PIPELINE</em><h2>${escapeHtml(content.title)}</h2></header><div class="pipeline__stages">${content.stages.map((stage, index) => `<article class="motion-secondary"><b>0${index + 1}</b><strong>${escapeHtml(stage)}</strong></article>`).join('')}</div><mark>${escapeHtml(content.output ?? 'OUTPUT READY')}</mark></div>`);
};

const renderBeforeAfter = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'before-after-scrub') throw new Error('Mismatched before-after content');
  const content = beat.content;
  return shell(beat, `<div class="before-after motion-primary"><section><em>BEFORE</em><h2>${escapeHtml(content.before)}</h2></section><div class="scrubber motion-secondary"></div><section><em>AFTER</em><h2>${escapeHtml(content.after)}</h2></section><mark>${escapeHtml(content.criterion)}${content.delta ? ` · ${escapeHtml(content.delta)}` : ''}</mark></div>`);
};

const renderEvidence = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'evidence-panel') throw new Error('Mismatched evidence content');
  const content = beat.content;
  const source = beat.evidence?.src ?? content.evidenceAsset;
  const label = beat.evidence?.label ?? content.sourceLabel;
  return shell(beat, `<div class="evidence motion-primary"><figure><img src="${escapeHtml(source)}" alt="${escapeHtml(content.caption)}"><figcaption>${escapeHtml(label)} · ${escapeHtml(content.caption)}</figcaption></figure><aside><em>EVIDENCE FIRST</em><h2>${escapeHtml(content.interpretation)}</h2></aside></div>`);
};

const renderMetric = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'metric-odometer') throw new Error('Mismatched metric content');
  return shell(beat, `<div class="metrics motion-primary">${beat.content.metrics.map((metric) => `<article class="motion-secondary" data-evidence-status="${metric.evidenceStatus}"><em>${escapeHtml(metric.evidenceStatus.toUpperCase())}</em><div><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.unit)}</span></div><p>${escapeHtml(metric.label)}</p>${metric.sourceLabel ? `<mark>${escapeHtml(metric.sourceLabel)}</mark>` : ''}</article>`).join('')}</div>`);
};

const renderSignalRoute = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'signal-route') throw new Error('Mismatched route content');
  const content = beat.content;
  return shell(beat, `<div class="signal-route motion-primary"><em>${escapeHtml(content.routeLabel)}</em><div class="route-nodes">${content.nodes.map((node, index) => `<span class="motion-secondary${content.failureNode === node ? ' is-checkpoint' : ''}"><b>${index + 1}</b>${escapeHtml(node)}</span>`).join('<i>→</i>')}</div><mark>${escapeHtml(content.result)}</mark></div>`);
};

const renderDoodle = (beat: StoryboardBeat): string => {
  if (beat.content.structure !== 'semantic-doodle') throw new Error('Mismatched doodle content');
  const content = beat.content;
  return shell(beat, `<div class="semantic-doodle motion-primary" style="--doodle-accent:${escapeHtml(content.accent)}"><aside><em>VISUAL METAPHOR</em><h2>${escapeHtml(content.subject)}</h2><p>${escapeHtml(content.action)}</p>${content.annotation ? `<small>${escapeHtml(content.annotation)}</small>` : ''}</aside><svg viewBox="0 0 640 360" fill="none" aria-label="${escapeHtml(`${content.subject} ${content.action} ${content.outcome}`)}"><g data-doodle-layer="line" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"><circle cx="132" cy="115" r="34"/><path d="M130 150c-8 45-5 83 12 112M142 183l58 24M142 183l-48 50M142 262l-42 61M142 262l53 58"/></g><g data-doodle-layer="action" fill="none" stroke="var(--doodle-accent)" stroke-width="10" stroke-linecap="round"><path d="M218 208h182"/><path d="m374 180 31 28-31 29"/></g><g data-doodle-layer="outcome" fill="none" stroke="currentColor" stroke-width="8"><rect x="472" y="103" width="96" height="96" rx="24"/><path d="m493 151 19 20 38-44" stroke="var(--doodle-accent)" stroke-width="12"/></g></svg><mark>${escapeHtml(content.outcome)}</mark></div>`);
};

const renderers: Record<SemanticStructure, (beat: StoryboardBeat) => string> = {
  'editorial-dual-rail': renderDualRail,
  'thesis-and-proof': renderThesisProof,
  'bidirectional-flow': renderBidirectionalFlow,
  'command-palette': renderCommandPalette,
  'four-stage-pipeline': renderPipeline,
  'before-after-scrub': renderBeforeAfter,
  'evidence-panel': renderEvidence,
  'metric-odometer': renderMetric,
  'signal-route': renderSignalRoute,
  'semantic-doodle': renderDoodle,
};

export const renderV2Beat = (beat: StoryboardBeat): string => renderers[beat.structure](beat);
