import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { GraphProvider } from '../context/GraphContext';
import GraphCanvas from './GraphCanvas';

const renderCanvas = () =>
  render(
    <GraphProvider>
      <GraphCanvas />
    </GraphProvider>,
  );

describe('GraphCanvas', () => {
  it('renders one node group per graph node and one line per edge', () => {
    const { container } = renderCanvas();
    expect(container.querySelectorAll('[data-node-id]')).toHaveLength(17);
    expect(container.querySelectorAll('[data-edge-id]')).toHaveLength(50);
  });

  it('keeps layer rects fully inside the viewBox', () => {
    const { container } = renderCanvas();
    const rects = [...container.querySelectorAll('rect[data-layer]')];
    expect(rects.length).toBe(3);
    for (const r of rects) {
      expect(Number(r.getAttribute('y'))).toBeGreaterThanOrEqual(0);
      expect(Number(r.getAttribute('y')) + Number(r.getAttribute('height'))).toBeLessThanOrEqual(600);
    }
  });

  it('exposes the full label as a title for truncated nodes', () => {
    const { container } = renderCanvas();
    const titles = [...container.querySelectorAll('[data-node-id] title')].map((t) => t.textContent);
    expect(titles).toContain('Fe/Al oxides (oxalate-extractable)');
  });

  it('clears the selection when the canvas background is clicked', () => {
    const { container } = renderCanvas();
    const svg = container.querySelector('svg')!;
    fireEvent.click(svg);
    expect(container.querySelectorAll('[data-dimmed="true"]')).toHaveLength(0);
  });
});
