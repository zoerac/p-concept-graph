import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { GraphProvider, useGraph } from '../context/GraphContext';
import Sidebar from './Sidebar';
import { useEffect } from 'react';


function Harness({ preselect }: { preselect: { type: 'node' | 'edge'; id: string } }) {
  const { select } = useGraph();
  useEffect(() => { select(preselect as never); }, []);
  return <Sidebar />;
}

const renderWith = (preselect: { type: 'node' | 'edge'; id: string }) =>
  render(<GraphProvider><Harness preselect={preselect} /></GraphProvider>);

describe('Sidebar', () => {
  it('shows the legend when nothing is selected', () => {
    render(<GraphProvider><Sidebar /></GraphProvider>);
    expect(screen.getByText(/点击节点或边/)).toBeInTheDocument();
  });

  it('lists every adjacent edge for a selected node', () => {
    renderWith({ type: 'node', id: 'ph' });
    const items = screen.getAllByTestId('edge-list-item');
    expect(items).toHaveLength(10);
  });

  it('renders evidence cards grouped by paper for a selected edge', () => {
    renderWith({ type: 'edge', id: 'olsen_p--ph' });
    const groups = screen.getAllByTestId('paper-group');
    expect(groups.length).toBeGreaterThan(1);
    expect(within(groups[0]).getAllByTestId('evidence-card').length).toBeLessThanOrEqual(5);
  });

  it('shows an expand button for a group above the threshold and reveals the rest on click', () => {
    renderWith({ type: 'edge', id: 'ca_bound_p--ca_carbonate' });
    const cards = () => screen.getAllByTestId('evidence-card').length;
    expect(cards()).toBeLessThan(43);
    fireEvent.click(screen.getAllByTestId('expand-group')[0]);
    expect(cards()).toBeGreaterThan(3);
  });

  it('never truncates a quote', () => {
    renderWith({ type: 'edge', id: 'olsen_p--ph' });
    const card = screen.getAllByTestId('evidence-card')[0];
    const quote = card.querySelector('[data-quote]')!;
    expect(quote.textContent!.length).toBeGreaterThan(20);
    expect(quote.textContent!.endsWith('…')).toBe(false);
  });
});
