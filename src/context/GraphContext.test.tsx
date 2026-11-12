import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { GraphProvider, useGraph } from './GraphContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => <GraphProvider>{children}</GraphProvider>;

describe('selection semantics', () => {
  it('selects a node then an edge exclusively', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.toggleNode('ph'));
    expect(result.current.selection).toEqual({ type: 'node', id: 'ph' });
    act(() => result.current.toggleEdge('ph--olsen_p'));
    expect(result.current.selection).toEqual({ type: 'edge', id: 'ph--olsen_p' });
  });

  it('deselects when the same node is clicked twice', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.toggleNode('ph'));
    act(() => result.current.toggleNode('ph'));
    expect(result.current.selection).toEqual({ type: 'none' });
  });

  it('deselects when the same edge is clicked twice', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.toggleEdge('ph--olsen_p'));
    act(() => result.current.toggleEdge('ph--olsen_p'));
    expect(result.current.selection).toEqual({ type: 'none' });
  });

  it('clears from any state', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.toggleNode('ph'));
    act(() => result.current.clear());
    expect(result.current.selection).toEqual({ type: 'none' });
  });

  it('exposes the frozen dataset', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    expect(result.current.data.nodes).toHaveLength(17);
    expect(result.current.data.edges).toHaveLength(50);
  });
});

describe('filter state', () => {
  it('starts at the full dataset', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    expect(result.current.filter).toEqual({ polarities: ['+', '-', '0'], minEvidence: 0 });
    expect(result.current.visibleData.edges).toHaveLength(50);
    expect(result.current.visibleData.nodes).toHaveLength(17);
  });

  it('narrows to negative edges only', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.togglePolarity('+'));
    act(() => result.current.togglePolarity('0'));
    expect(result.current.visibleData.edges).toHaveLength(19);
    expect(result.current.visibleData.nodes).toHaveLength(14);
  });

  it('allows an empty polarity set instead of falling back to all', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.setFilter({ polarities: [], minEvidence: 0 }));
    expect(result.current.visibleData.edges).toHaveLength(0);
    expect(result.current.visibleData.nodes).toHaveLength(0);
  });

  it('applies the evidence floor', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.setMinEvidence(5));
    expect(result.current.visibleData.edges).toHaveLength(15);
    expect(result.current.visibleData.nodes).toHaveLength(12);
  });

  it('clears a selection that the new filter hides', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.toggleEdge('om--ph'));
    act(() => result.current.setMinEvidence(2));
    expect(result.current.selection).toEqual({ type: 'none' });
  });

  it('keeps a selection that survives the filter', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.toggleNode('ph'));
    act(() => result.current.setMinEvidence(2));
    expect(result.current.selection).toEqual({ type: 'node', id: 'ph' });
  });

  it('returns to the default view on reset, keeping the selection when it survives', () => {
    const { result } = renderHook(() => useGraph(), { wrapper });
    act(() => result.current.toggleNode('ph'));
    act(() => result.current.togglePolarity('-'));
    act(() => result.current.resetFilter());
    expect(result.current.filter).toEqual({ polarities: ['+', '-', '0'], minEvidence: 0 });
    expect(result.current.visibleData.edges).toHaveLength(50);
    expect(result.current.selection).toEqual({ type: 'node', id: 'ph' });
  });
});
