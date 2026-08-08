import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {VISUAL_STRUCTURES} from '../../core/src/schema';
import {structureRegistry} from '../src/structures';

describe('structureRegistry', () => {
  it('registers 18 distinct renderable visual structures', () => {
    expect(Object.keys(structureRegistry).sort()).toEqual([...VISUAL_STRUCTURES].sort());
    for (const name of VISUAL_STRUCTURES) {
      const entry = structureRegistry[name];
      expect(entry.safeZone).toMatch(/^(left|right|center|full)$/);
      expect(entry.aspectRatios.length).toBeGreaterThan(0);
      expect(entry.motions.length).toBeGreaterThan(0);
      const markup = renderToStaticMarkup(
        <entry.Component text="真实结构预览" kicker="PUBLIC SKILL" progress={0.65} accent="#5eead4" />,
      );
      expect(markup).toContain('真实结构预览');
      expect(markup.length).toBeGreaterThan(180);
    }
  });
});
