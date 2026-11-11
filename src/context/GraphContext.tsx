import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import data from '../data/graph_data.json';
import type { GraphData, SelectionState } from '../types/graph';

const graphData = data as unknown as GraphData;

interface GraphContextValue {
  data: GraphData;
  selection: SelectionState;
  select: (s: SelectionState) => void;
  toggleNode: (id: string) => void;
  toggleEdge: (id: string) => void;
  clear: () => void;
}

const GraphContext = createContext<GraphContextValue | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>({ type: 'none' });

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
    () => ({ data: graphData, selection, select, toggleNode, toggleEdge, clear }),
    [selection, select, toggleNode, toggleEdge, clear],
  );

  return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
}

export function useGraph(): GraphContextValue {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error('useGraph must be used inside <GraphProvider>');
  return ctx;
}
