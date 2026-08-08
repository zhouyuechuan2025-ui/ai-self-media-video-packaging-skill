import {describe, expect, it} from 'vitest';
import {approvedGate, requireCumulativeApprovals, requireRenderAuthorization} from '../scripts/lib/gates';

describe('four-gate CLI contract', () => {
  it('treats no approval as Gate A analysis only', () => {
    expect(approvedGate({})).toBe('A');
    expect(() => requireCumulativeApprovals({}, 'A')).not.toThrow();
  });

  it('requires every cumulative approval before entering a later gate', () => {
    expect(() => requireCumulativeApprovals({'approve-gate-b': true}, 'B')).toThrow(/approve-gate-a/i);
    expect(() => requireCumulativeApprovals({'approve-gate-a': true, 'approve-gate-b': true, 'approve-gate-c': true}, 'C')).not.toThrow();
    expect(() => requireCumulativeApprovals({'approve-gate-d': true}, 'D')).toThrow(/approve-gate-a.*approve-gate-b.*approve-gate-c/i);
  });

  it('refuses final render without explicit Gate D authorization', () => {
    const gateC = {'approve-gate-a': true, 'approve-gate-b': true, 'approve-gate-c': true, render: true};
    expect(() => requireRenderAuthorization(gateC)).toThrow(/approve-gate-d/i);
    const gateD = {...gateC, 'approve-gate-d': true};
    expect(() => requireRenderAuthorization(gateD)).not.toThrow();
  });
});

