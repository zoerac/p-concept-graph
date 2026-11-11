import { describe, expect, it } from 'vitest';
import { buildEdgeIndex, highlightSets } from './highlight';
import type { GraphData } from '../types/graph';

const data: GraphData = {
  nodes: [
    { id: 'a', label: 'A', x: 0, y: 0, layer: 'property' },
    { id: 'b', label: 'B', x: 0.5, y: 0, layer: 'property' },
    { id: 'c', label: 'C', x: 1, y: 1, layer: 'p_state' },
    { id: 'z', label: 'Z', x: 0, y: 0.5, layer: 'metric' },
  ],
  edges: [
    { id: 'a--b', head: 'a', tail: 'b', polarity: '+', mechanism_hint: '', evidence: [] },
    { id: 'b--c', head: 'b', tail: 'c', polarity: '-', mechanism_hint: '', evidence: [] },
  ],
} as GraphData;

describe('buildEdgeIndex', () => {
  it('indexes both endpoints of every edge', () => {
    const idx = buildEdgeIndex(data);
    expect(idx.get('a')).toEqual(new Set(['a--b']));
    expect(idx.get('b')).toEqual(new Set(['a--b', 'b--c']));
    expect(idx.get('z')).toBeUndefined();
  });
});

describe('highlightSets', () => {
  it('returns nulls when nothing is selected', () => {
    expect(highlightSets(data, { type: 'none' })).toEqual({ nodeIds: null, edgeIds: null });
  });

  it('keeps the selected node and its direct neighbours', () => {
    const s = highlightSets(data, { type: 'node', id: 'b' })!;
    expect(s.nodeIds).toEqual(new Set(['a', 'b', 'c']));
    expect(s.edgeIds).toEqual(new Set(['a--b', 'b--c']));
  });

  it('keeps both endpoints and only that edge when an edge is selected', () => {
    const s = highlightSets(data, { type: 'edge', id: 'a--b' })!;
    expect(s.nodeIds).toEqual(new Set(['a', 'b']));
    expect(s.edgeIds).toEqual(new Set(['a--b']));
  });

  it('does not throw for an unknown id', () => {
    expect(() => highlightSets(data, { type: 'node', id: 'nope' })).not.toThrow();
  });
});
