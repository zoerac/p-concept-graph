import { createContext, useContext, useState, type ReactNode } from 'react';
import type { GraphData, SelectionState } from '../types/graph';
import rawData from '../data/graph_data.json';

const data = rawData as GraphData;

interface GraphContextValue {
  data: GraphData;
  selection: SelectionState;
  setSelection: (s: SelectionState) => void;
}

const GraphContext = createContext<GraphContextValue | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>({ type: 'none' });
  return (
    <GraphContext.Provider value={{ data, selection, setSelection }}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error('useGraph must be used inside GraphProvider');
  return ctx;
}
