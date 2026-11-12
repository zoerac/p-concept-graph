import type { GraphData, GraphEdge, GraphFilter, Polarity, SelectionState } from '../types/graph';

export const DEFAULT_FILTER: GraphFilter = { polarities: ['+', '-', '0'], minEvidence: 0 };
export const MIN_EVIDENCE_OPTIONS: readonly number[] = [0, 2, 3, 5];

export function matchesFilter(edge: GraphEdge, filter: GraphFilter): boolean {
  return filter.polarities.includes(edge.polarity) && edge.evidence.length >= filter.minEvidence;
}

export function visibleSets(data: GraphData, filter: GraphFilter) {
  const edgeIds = new Set<string>();
  const nodeIds = new Set<string>();
  for (const edge of data.edges) {
    if (!matchesFilter(edge, filter)) continue;
    edgeIds.add(edge.id);
    nodeIds.add(edge.head);
    nodeIds.add(edge.tail);
  }
  return { edgeIds, nodeIds };
}

export function filterVisibleData(data: GraphData, filter: GraphFilter): GraphData {
  const { edgeIds, nodeIds } = visibleSets(data, filter);
  return {
    edges: data.edges.filter((edge) => edgeIds.has(edge.id)),
    nodes: data.nodes.filter((node) => nodeIds.has(node.id)),
  };
}

export function isSelectionVisible(data: GraphData, filter: GraphFilter, selection: SelectionState): boolean {
  if (selection.type === 'none') return true;
  const visible = visibleSets(data, filter);
  return selection.type === 'edge' ? visible.edgeIds.has(selection.id) : visible.nodeIds.has(selection.id);
}

export function polarityCounts(data: GraphData): Record<Polarity, number> {
  const counts: Record<Polarity, number> = { '+': 0, '-': 0, '0': 0 };
  for (const edge of data.edges) counts[edge.polarity]++;
  return counts;
}

export function isDefaultFilter(filter: GraphFilter): boolean {
  return filter.minEvidence === 0 && new Set(filter.polarities).size === 3 &&
    ['+', '-', '0'].every((polarity) => filter.polarities.includes(polarity as Polarity));
}
