import {describe, expect, it} from 'vitest';
import {motionFrame} from '../src/motion';
import {MOTION_PRIMITIVES} from '../../core/src/schema';

describe('motionFrame', () => {
  it.each(MOTION_PRIMITIVES)('%s is deterministic, clamped, and seek-safe', (name) => {
    const input = {name, fps: 30, startFrame: 30, durationFrames: 60} as const;
    const before = motionFrame({...input, frame: 0});
    const start = motionFrame({...input, frame: 30});
    const middle = motionFrame({...input, frame: 60});
    const end = motionFrame({...input, frame: 90});
    const after = motionFrame({...input, frame: 180});

    expect(before.progress).toBe(0);
    expect(start.progress).toBe(0);
    expect(middle.progress).toBeGreaterThan(0);
    expect(end.progress).toBe(1);
    expect(after).toEqual(end);
    expect(motionFrame({...input, frame: 60})).toEqual(middle);
    Object.values(middle).forEach((value) => expect(Number.isFinite(value)).toBe(true));
  });
});
