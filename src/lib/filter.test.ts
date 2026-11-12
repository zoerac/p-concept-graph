import { describe, expect, it } from 'vitest';
import data from '../data/graph_data.json';
import type { GraphData } from '../types/graph';
import {
  DEFAULT_FILTER,
  filterVisibleData,
  isDefaultFilter,
  isSelectionVisible,
  matchesFilter,
  polarityCounts,
  visibleSets,
} from './filter';

const g = data as unknown as GraphData;
const F = (polarities: ('+' | '-' | '0')[], minEvidence = 0) => ({ polarities, minEvidence });

describe('polarityCounts', () => {
  it('counts the dataset by polarity', () => {
    expect(polarityCounts(g)).toEqual({ '+': 22, '-': 19, '0': 9 });
  });
});

describe('matchesFilter', () => {
  const edge = g.edges.find((e) => e.id === 'om--ph')!;
  it('accepts matching polarity and sufficient evidence', () => {
    expect(matchesFilter(edge, F(['-']))).toBe(true);
    expect(matchesFilter(edge, F(['-'], 1))).toBe(true);
  });
  it('rejects on polarity mismatch', () => {
    expect(matchesFilter(edge, F(['+', '0']))).toBe(false);
  });
  it('rejects when evidence is below the floor', () => {
    expect(matchesFilter(edge, F(['-'], 2))).toBe(false);
  });
});

describe('visibleSets / filterVisibleData', () => {
  const cases: [string, ('+' | '-' | '0')[], number, number, number][] = [
    ['default', ['+', '-', '0'], 0, 50, 17],
    ['all >=2', ['+', '-', '0'], 2, 34, 17],
    ['all >=3', ['+', '-', '0'], 3, 23, 15],
    ['all >=5', ['+', '-', '0'], 5, 15, 12],
    ['negative only', ['-'], 0, 19, 14],
    ['positive only', ['+'], 0, 22, 15],
    ['unspecified only', ['0'], 0, 9, 11],
    ['positive and negative', ['+', '-'], 0, 41, 16],
    ['negative >=5', ['-'], 5, 4, 6],
    ['nothing selected', [], 0, 0, 0],
  ];

  it.each(cases)('%s', (_name, polarities, minEvidence, edges, nodes) => {
    const f = F(polarities, minEvidence);
    const { edgeIds, nodeIds } = visibleSets(g, f);
    expect(edgeIds.size).toBe(edges);
    expect(nodeIds.size).toBe(nodes);
    const v = filterVisibleData(g, f);
    expect(v.edges).toHaveLength(edges);
    expect(v.nodes).toHaveLength(nodes);
  });

  it('keeps no node that has no visible edge', () => {
    const v = filterVisibleData(g, F(['0']));
    const touched = new Set(v.edges.flatMap((e) => [e.head, e.tail]));
    expect(v.nodes.map((n) => n.id).every((id) => touched.has(id))).toBe(true);
  });

  it('treats minEvidence 0 and 1 alike', () => {
    expect(visibleSets(g, F(['+', '-', '0'], 0)).edgeIds.size).toBe(
      visibleSets(g, F(['+', '-', '0'], 1)).edgeIds.size,
    );
  });
});

describe('isSelectionVisible', () => {
  it('keeps an empty selection always valid', () => {
    expect(isSelectionVisible(g, F([]), { type: 'none' })).toBe(true);
  });
  it('rejects a hidden edge and accepts a visible one', () => {
    const f = F(['+', '-', '0'], 2);
    expect(isSelectionVisible(g, f, { type: 'edge', id: 'om--ph' })).toBe(false);
    expect(isSelectionVisible(g, f, { type: 'edge', id: 'al_bound_p--ph' })).toBe(true);
  });
  it('rejects a node that the filter removed', () => {
    expect(isSelectionVisible(g, F(['0']), { type: 'node', id: 'qmax' })).toBe(false);
    expect(isSelectionVisible(g, F(['0']), { type: 'node', id: 'ph' })).toBe(true);
  });
});

describe('isDefaultFilter', () => {
  it('is true only for the default shape', () => {
    expect(isDefaultFilter(DEFAULT_FILTER)).toBe(true);
    expect(isDefaultFilter(F(['+', '-'], 0))).toBe(false);
    expect(isDefaultFilter(F(['+', '-', '0'], 2))).toBe(false);
  });
});
