import { describe, expect, it } from 'vitest';
import data from './graph_data.json';
import type { GraphData } from '../types/graph';

const g = data as unknown as GraphData;

describe('graph_data contract', () => {
  it('has 17 nodes and 50 edges', () => {
    expect(g.nodes).toHaveLength(17);
    expect(g.edges).toHaveLength(50);
  });

  it('excludes the isolated dps node', () => {
    expect(g.nodes.some((n) => n.id === 'dps')).toBe(false);
  });

  it('keeps all coordinates normalized to [0,1]', () => {
    for (const n of g.nodes) {
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.x).toBeLessThanOrEqual(1);
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeLessThanOrEqual(1);
    }
  });

  it('has at least one edge with 43 evidence items and no empty evidence', () => {
    expect(Math.max(...g.edges.map((e) => e.evidence.length))).toBe(43);
    expect(g.edges.every((e) => e.evidence.length > 0)).toBe(true);
  });

  it('uses only the three polarity values', () => {
    expect(new Set(g.edges.map((e) => e.polarity))).toEqual(new Set(['+', '-', '0']));
  });
});
