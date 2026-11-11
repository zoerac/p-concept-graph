import { describe, expect, it } from 'vitest';
import { collapseState, groupEvidence } from './evidence';
import type { Evidence } from '../types/graph';

const ev = (unit_id: string, paper: string): Evidence =>
  ({ unit_id, paper, quote: `q-${unit_id}` } as Evidence);

describe('groupEvidence', () => {
  it('groups by paper preserving first-appearance order', () => {
    const out = groupEvidence([ev('u1', 'P1'), ev('u2', 'P2'), ev('u3', 'P1')]);
    expect(out.map((g) => g.paper)).toEqual(['P1', 'P2']);
    expect(out[0].items).toHaveLength(2);
    expect(out[1].items).toHaveLength(1);
  });

  it('returns an empty array for no evidence', () => {
    expect(groupEvidence([])).toEqual([]);
  });
});

describe('collapseState', () => {
  it('shows everything up to the expand threshold', () => {
    for (const n of [0, 1, 3, 4, 5]) {
      expect(collapseState(n)).toEqual({ visible: n, hidden: 0, canExpand: false });
    }
  });

  it('collapses to 3 with an expand affordance above the threshold', () => {
    expect(collapseState(6)).toEqual({ visible: 3, hidden: 3, canExpand: true });
    expect(collapseState(43)).toEqual({ visible: 3, hidden: 40, canExpand: true });
  });
});
