import {describe, expect, it} from 'vitest';
import {SEMANTIC_STRUCTURES, type Storyboard} from '../../core/src/schema';
import {generateHyperFramesProject} from '../src/generate';
import {markupIdentity} from '../src/v2-markup';

const contents: Storyboard['beats'][number]['content'][] = [
  {structure: 'editorial-dual-rail', kicker: 'Core', headline: 'Two rails', leftItems: [{label: 'Before', detail: 'Loose notes'}], rightItems: [{label: 'After', detail: 'Clear actions'}], takeaway: 'Keep the center clear'},
  {structure: 'thesis-and-proof', thesis: 'Structure follows meaning', reason: 'Each claim receives an appropriate visual grammar'},
  {structure: 'bidirectional-flow', leftLabel: 'Script', rightLabel: 'Video', forwardAction: 'Generate', returnAction: 'Review', result: 'Closed loop'},
  {structure: 'command-palette', commandTitle: 'Run list', actions: ['Read SRT', 'Plan visuals', 'Wait for approval'], resultState: 'READY'},
  {structure: 'four-stage-pipeline', title: 'Packaging flow', stages: ['Analyze', 'Design', 'Review', 'Render'], output: 'Verified output'},
  {structure: 'before-after-scrub', before: 'Generic card', after: 'Semantic layout', criterion: 'Visual grammar'},
  {structure: 'evidence-panel', evidenceAsset: 'evidence/source.png', caption: 'Primary source', sourceLabel: 'Official docs', interpretation: 'Evidence before decoration'},
  {structure: 'metric-odometer', metrics: [{value: '10', unit: '', label: 'Structures', evidenceStatus: 'sourced', sourceLabel: 'V2 contract'}]},
  {structure: 'signal-route', nodes: ['SRT', 'Meaning', 'Template', 'Output'], routeLabel: 'Signal route', result: 'Traceable output'},
  {structure: 'semantic-doodle', subject: 'Creator', action: 'Pushes workflow', outcome: 'Delivers result', accent: '#e97a5f'},
];

const storyboard: Storyboard = {
  version: '2.0',
  id: 'hf-v2-test',
  title: 'HF V2 test',
  duration: 20,
  fps: 30,
  width: 1920,
  height: 1080,
  captionsMode: 'burned-in',
  source: {video: 'input.mp4'},
  theme: {background: '#07101f', foreground: '#f8fafc', accent: '#5eead4'},
  beats: contents.map((content, index) => ({
    id: `b${index + 1}`,
    start: index * 2,
    end: index * 2 + 2,
    text: content.structure,
    structure: content.structure,
    content,
    motions: index % 2 === 0 ? ['reveal'] : ['slide'],
    placement: ['four-stage-pipeline', 'before-after-scrub', 'evidence-panel', 'metric-odometer', 'signal-route', 'semantic-doodle'].includes(content.structure) ? 'full' : index % 2 === 0 ? 'left' : 'right',
    palette: index % 2 === 0 ? 'deep-ocean' : 'editorial-cream',
    directorRole: index === 0 ? 'hook' : content.structure === 'evidence-panel' ? 'evidence' : 'definition',
    ...(content.structure === 'evidence-panel' ? {evidence: {src: 'evidence/source.png', label: 'Official docs'}} : {}),
  })) as Storyboard['beats'],
};

describe('generateHyperFramesProject V2', () => {
  it('preserves all semantic structures instead of collapsing them into one shell', () => {
    const result = generateHyperFramesProject(storyboard);
    for (const structure of SEMANTIC_STRUCTURES) {
      expect(result.html).toContain(`data-semantic-structure="${structure}"`);
    }
    expect(new Set(SEMANTIC_STRUCTURES.map(markupIdentity)).size).toBe(10);
  });

  it('emits continuous media, protected lanes, and one seek-safe paused timeline', () => {
    const result = generateHyperFramesProject(storyboard);
    expect(result.html).toContain('<video id="source-video"');
    expect(result.html).toContain('data-has-audio="true"');
    expect(result.html).toContain('data-presenter-safe-center="35-65"');
    expect(result.html).toContain('data-subtitle-safe-bottom="18"');
    expect(result.html).toContain('gsap.timeline({paused:true})');
    expect(result.html).toContain('window.__timelines.main');
    expect(result.motion.duration).toBe(20);
    expect(result.motion.assertions).toHaveLength(20);
    expect(result.html).toContain('data-presentation-mode="presenter-safe"');
    expect(result.html).toContain('data-presentation-mode="opaque-full-screen"');
    expect(result.html).toContain('.beat[data-presentation-mode=opaque-full-screen] .beat__motion');
    expect(result.html).not.toContain('top:7%;bottom:18%;width:27%');
  });

  it('escapes content and evidence values', () => {
    const unsafe = structuredClone(storyboard);
    unsafe.beats[6].content = {...unsafe.beats[6].content, interpretation: '<script>alert(1)</script>'} as Storyboard['beats'][number]['content'];
    unsafe.beats[6].evidence = {src: 'evidence/source.png?x=<bad>', label: '<Official>'};
    const result = generateHyperFramesProject(unsafe);
    expect(result.html).not.toContain('<script>alert(1)</script>');
    expect(result.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(result.html).toContain('&lt;Official&gt;');
  });
});
