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
  polarity: '+' | '-' | '0';
  mechanism_hint: string;
  evidence: Evidence[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type SelectionState =
  | { type: 'none' }
  | { type: 'node'; id: string }
  | { type: 'edge'; id: string };
