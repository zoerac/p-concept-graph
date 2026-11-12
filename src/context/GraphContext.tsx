import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import data from '../data/graph_data.json';
import type { GraphData, GraphFilter, Polarity, SelectionState } from '../types/graph';
import { DEFAULT_FILTER, filterVisibleData, isSelectionVisible } from '../lib/filter';

const graphData = data as unknown as GraphData;

interface GraphContextValue {
  data: GraphData;
  visibleData: GraphData;
  filter: GraphFilter;
  setFilter: (next: GraphFilter) => void;
  togglePolarity: (p: Polarity) => void;
  setMinEvidence: (n: number) => void;
  resetFilter: () => void;
  selection: SelectionState;
  select: (s: SelectionState) => void;
  toggleNode: (id: string) => void;
  toggleEdge: (id: string) => void;
  clear: () => void;
}

const GraphContext = createContext<GraphContextValue | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>({ type: 'none' });
  const [filter, setFilterState] = useState<GraphFilter>(DEFAULT_FILTER);

  const applyFilter = useCallback((next: GraphFilter) => {
    setFilterState(next);
    setSelection((cur) => (isSelectionVisible(graphData, next, cur) ? cur : { type: 'none' }));
  }, []);
  const setFilter = useCallback((next: GraphFilter) => applyFilter(next), [applyFilter]);
  const togglePolarity = useCallback(
    (p: Polarity) => applyFilter({
      ...filter,
      polarities: filter.polarities.includes(p)
        ? filter.polarities.filter((x) => x !== p)
        : [...filter.polarities, p],
    }),
    [applyFilter, filter],
  );
  const setMinEvidence = useCallback((n: number) => applyFilter({ ...filter, minEvidence: n }), [applyFilter, filter]);
  const resetFilter = useCallback(() => applyFilter(DEFAULT_FILTER), [applyFilter]);
  const visibleData = useMemo(() => filterVisibleData(graphData, filter), [filter]);

  const select = useCallback((s: SelectionState) => setSelection(s), []);
  const toggleNode = useCallback(
    (id: string) =>
      setSelection((cur) => (cur.type === 'node' && cur.id === id ? { type: 'none' } : { type: 'node', id })),
    [],
  );
  const toggleEdge = useCallback(
    (id: string) =>
      setSelection((cur) => (cur.type === 'edge' && cur.id === id ? { type: 'none' } : { type: 'edge', id })),
    [],
  );
  const clear = useCallback(() => setSelection({ type: 'none' }), []);

  const value = useMemo(
    () => ({
      data: graphData,
      visibleData,
      filter,
      setFilter,
      togglePolarity,
      setMinEvidence,
      resetFilter,
      selection,
      select,
      toggleNode,
      toggleEdge,
      clear,
    }),
    [visibleData, filter, setFilter, togglePolarity, setMinEvidence, resetFilter, selection, select, toggleNode, toggleEdge, clear],
  );

  return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
}

export function useGraph(): GraphContextValue {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error('useGraph must be used inside <GraphProvider>');
  return ctx;
}
