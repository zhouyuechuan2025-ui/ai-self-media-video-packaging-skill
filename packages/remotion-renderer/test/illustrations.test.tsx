import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {ILLUSTRATION_SCENARIOS} from '../../core/src/schema';
import {illustrationRegistry} from '../src/illustrations';
import {SemanticDoodle} from '../src/illustrations/SemanticDoodle';

describe('illustrationRegistry', () => {
  it('renders six deterministic transparent line illustrations', () => {
    expect(Object.keys(illustrationRegistry).sort()).toEqual([...ILLUSTRATION_SCENARIOS].sort());
    for (const name of ILLUSTRATION_SCENARIOS) {
      const Component = illustrationRegistry[name];
      const first = renderToStaticMarkup(<Component progress={0.72} accent="#5eead4" />);
      const second = renderToStaticMarkup(<Component progress={0.72} accent="#5eead4" />);
      expect(first).toBe(second);
      expect(first).toContain('viewBox="0 0 640 360"');
      expect(first).toContain('fill="none"');
      expect(first).toContain('stroke="#252933"');
      expect(first).not.toMatch(/<text|logo|watermark/i);
      expect(first.length).toBeGreaterThan(240);
    }
  });

  it('renders line, action, and outcome layers for an integrated semantic doodle', () => {
    const markup = renderToStaticMarkup(
      <SemanticDoodle
        progress={0.72}
        accent="#e97a5f"
        subject="创作者"
        action="推动流程"
        outcome="完成交付"
      />,
    );
    expect(markup).toContain('data-doodle-layer="line"');
    expect(markup).toContain('data-doodle-layer="action"');
    expect(markup).toContain('data-doodle-layer="outcome"');
    expect(markup).toContain('fill="none"');
  });
});
