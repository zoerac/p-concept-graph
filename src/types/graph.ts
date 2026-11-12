export interface Evidence {
  unit_id: string;
  quote: string;
  paper: string;
}

export interface GraphNode {
  id: string;
  label: string;
  layer: 'property' | 'metric' | 'p_state';
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  head: string;
  tail: string;
  polarity: Polarity;
  mechanism_hint: string;
  evidence: Evidence[];
}

export type Polarity = '+' | '-' | '0';

export interface GraphFilter {
  /** 选中的极性；空数组表示空图，不是"全选" */
  polarities: Polarity[];
  /** 证据条数下限；0 表示不限 */
  minEvidence: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type SelectionState =
  | { type: 'none' }
  | { type: 'node'; id: string }
  | { type: 'edge'; id: string };
