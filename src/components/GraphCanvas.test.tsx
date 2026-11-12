import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { GraphProvider, useGraph } from '../context/GraphContext';
import GraphCanvas from './GraphCanvas';

const renderCanvas = () =>
  render(
    <GraphProvider>
      <GraphCanvas />
    </GraphProvider>,
  );

function CanvasWithFilter({ polarities, minEvidence = 0 }: { polarities: ('+' | '-' | '0')[]; minEvidence?: number }) {
  const { setFilter } = useGraph();
  useEffect(() => { setFilter({ polarities, minEvidence }); }, [setFilter, polarities, minEvidence]);
  return <GraphCanvas />;
}

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

  it('renders only the edges that pass the filter', () => {
    const { container } = render(
      <GraphProvider><CanvasWithFilter polarities={['-']} /></GraphProvider>,
    );
    expect(container.querySelectorAll('[data-edge-id]')).toHaveLength(19);
    expect(container.querySelectorAll('[data-node-id]')).toHaveLength(14);
  });

  it('does not render hidden edges at all (no faded leftovers)', () => {
    const { container } = render(
      <GraphProvider><CanvasWithFilter polarities={['+', '-', '0']} minEvidence={2} /></GraphProvider>,
    );
    expect(container.querySelectorAll('[data-edge-id]')).toHaveLength(34);
    expect(container.querySelectorAll('[data-node-id]')).toHaveLength(17);
    expect(container.querySelector('[data-edge-id="om--ph"]')).toBeNull();
  });

  it('keeps layer boxes pinned to the full layout under any filter', () => {
    const all = render(<GraphProvider><GraphCanvas /></GraphProvider>);
    const narrow = render(<GraphProvider><CanvasWithFilter polarities={['-']} /></GraphProvider>);
    const snap = (c: HTMLElement) =>
      [...c.querySelectorAll('rect[data-layer]')].map((r) =>
        ['x', 'y', 'width', 'height'].map((k) => r.getAttribute(k)).join(','),
      );
    expect(narrow.container.querySelectorAll('[data-edge-id]')).toHaveLength(19);
    expect(snap(narrow.container)).toEqual(snap(all.container));
  });

  it('shows a hint instead of a blank canvas when nothing matches', () => {
    const { container } = render(
      <GraphProvider><CanvasWithFilter polarities={[]} /></GraphProvider>,
    );
    expect(container.querySelectorAll('[data-edge-id]')).toHaveLength(0);
    expect(screen.getByTestId('empty-filter-hint')).toHaveTextContent('当前筛选无匹配边');
    expect(container.querySelectorAll('rect[data-layer]')).toHaveLength(3);
  });
});
