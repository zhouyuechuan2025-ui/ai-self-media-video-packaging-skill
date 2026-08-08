import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {VISUAL_STRUCTURES} from '../../core/src/schema';
import {PALETTES} from '../../core/src/palettes';
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
        <entry.Component text="真实结构预览" kicker="PUBLIC SKILL" progress={0.65} palette={PALETTES['deep-ocean']} placement="left" />,
      );
      expect(markup).toContain('真实结构预览');
      expect(markup.length).toBeGreaterThan(180);
    }
  });

  it('uses genuinely distinct visual families instead of one universal card shell', () => {
    const cases = {
      'impact-question': 'impact',
      'gradient-keyword': 'gradient',
      'signal-route': 'route',
      'contrarian-stamp': 'editorial',
      'completion-rail': 'completion',
      'capability-matrix': 'supporting',
    } as const;

    for (const [structure, family] of Object.entries(cases)) {
      const entry = structureRegistry[structure as keyof typeof structureRegistry];
      const markup = renderToStaticMarkup(
        <entry.Component text="多视觉语法" kicker="REAL TEMPLATE" progress={0.65} palette={PALETTES['violet-sunset']} placement="right" />,
      );
      expect(markup).toContain(`data-visual-family="${family}"`);
    }
  });
});
