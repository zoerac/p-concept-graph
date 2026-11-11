import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { GraphProvider, useGraph } from '../context/GraphContext';
import EdgeDetail from './EdgeDetail';
import { useEffect } from 'react';

function Harness({ edgeId }: { edgeId: string }) {
  const { data, select } = useGraph();
  const edge = data.edges.find((e) => e.id === edgeId);
  useEffect(() => {
    select({ type: 'edge', id: edgeId });
  }, [edgeId, select]);
  return edge ? <EdgeDetail edge={edge} /> : null;
}

const renderEdge = (edgeId: string) =>
  render(
    <GraphProvider>
      <Harness edgeId={edgeId} />
    </GraphProvider>,
  );

describe('EdgeDetail state leak regression', () => {
  it('resets expanded state when switching edges', () => {
    const { rerender } = renderEdge('ca_bound_p--ca_carbonate');
    fireEvent.click(screen.getAllByTestId('expand-group')[0]);
    const firstCount = screen.getAllByTestId('evidence-card').length;
    expect(firstCount).toBeGreaterThan(3);

    rerender(
      <GraphProvider>
        <Harness edgeId="om--sorption_capacity" />
      </GraphProvider>,
    );
    const groups = screen.getAllByTestId('paper-group');
    for (const g of groups) {
      const headerText = g.textContent;
      const match = headerText?.match(/\((\d+) 条\)/);
      const declared = match ? parseInt(match[1], 10) : 0;
      const cards = within(g).getAllByTestId('evidence-card').length;
      if (declared <= 5) {
        expect(cards).toBe(declared);
      } else {
        expect(cards).toBeLessThanOrEqual(3);
      }
    }
  });

  it('resets collapsed header state when switching edges', () => {
    const { rerender } = renderEdge('ca_bound_p--ca_carbonate');
    const groups = screen.getAllByTestId('paper-group');
    const buttons = within(groups[0]).getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(within(groups[0]).queryAllByTestId('evidence-card')).toHaveLength(0);

    rerender(
      <GraphProvider>
        <Harness edgeId="om--sorption_capacity" />
      </GraphProvider>,
    );
    expect(screen.getAllByTestId('evidence-card').length).toBeGreaterThan(0);
  });
});
