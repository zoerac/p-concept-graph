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
