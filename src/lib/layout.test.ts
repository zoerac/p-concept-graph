import { describe, expect, it } from 'vitest';
import { VIEW_H, VIEW_W, layerBox, toScreen } from './layout';
import type { GraphNode } from '../types/graph';

const node = (id: string, x: number, y: number, layer: string): GraphNode =>
  ({ id, label: id, x, y, layer } as GraphNode);

describe('toScreen', () => {
  it('keeps every node clear of the left and right canvas edges', () => {
    for (const x of [0, 0.5, 1]) {
      const cx = toScreen({ x, y: 0.5 }).cx;
      expect(cx).toBeGreaterThan(60);
      expect(cx).toBeLessThan(VIEW_W - 60);
    }
  });

  it('maps x monotonically across the usable band', () => {
    const a = toScreen({ x: 0, y: 0.5 }).cx;
    const b = toScreen({ x: 0.5, y: 0.5 }).cx;
    const c = toScreen({ x: 1, y: 0.5 }).cx;
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });

  it('keeps every layer row fully inside the viewport vertically', () => {
    for (const y of [0, 0.5, 1]) {
      const cy = toScreen({ x: 0.5, y }).cy;
      expect(cy).toBeGreaterThan(50);
      expect(cy).toBeLessThan(VIEW_H - 50);
    }
  });

  it('preserves layer order top to bottom', () => {
    const a = toScreen({ x: 0.5, y: 0 }).cy;
    const b = toScreen({ x: 0.5, y: 0.5 }).cy;
    const c = toScreen({ x: 0.5, y: 1 }).cy;
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });
});

describe('layerBox', () => {
  const nodes = [node('a', 0, 0, 'property'), node('b', 1, 0, 'property')];

  it('stays entirely within the canvas for the top layer', () => {
    const box = layerBox(nodes, 'property')!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(VIEW_H);
  });

  it('stays entirely within the canvas for the bottom layer', () => {
    const bottom = [node('a', 0, 1, 'p_state'), node('b', 1, 1, 'p_state')];
    const box = layerBox(bottom, 'p_state')!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(VIEW_H);
  });

  it('stays within the canvas horizontally and spans the outer nodes', () => {
    const box = layerBox(nodes, 'property')!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(VIEW_W);
    expect(box.x).toBeLessThan(toScreen({ x: 0, y: 0 }).cx);
    expect(box.x + box.width).toBeGreaterThan(toScreen({ x: 1, y: 0 }).cx);
  });

  it('returns null for a layer with no nodes', () => {
    expect(layerBox([], 'metric')).toBeNull();
  });
});
