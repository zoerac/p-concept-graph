import type { GraphData, SelectionState } from '../types/graph';

export function buildEdgeIndex(data: GraphData): Map<string, Set<string>> {
  const idx = new Map<string, Set<string>>();
  for (const e of data.edges) {
    for (const n of [e.head, e.tail]) {
      if (!idx.has(n)) idx.set(n, new Set());
      idx.get(n)!.add(e.id);
    }
  }
  return idx;
}

export function highlightSets(
  data: GraphData,
  selection: SelectionState,
): { nodeIds: Set<string> | null; edgeIds: Set<string> | null } {
  if (selection.type === 'none') return { nodeIds: null, edgeIds: null };

  if (selection.type === 'edge') {
    const edge = data.edges.find((e) => e.id === selection.id);
    if (!edge) return { nodeIds: new Set(), edgeIds: new Set() };
    return { nodeIds: new Set([edge.head, edge.tail]), edgeIds: new Set([edge.id]) };
  }

  const edgeIds = buildEdgeIndex(data).get(selection.id);
  if (!edgeIds) return { nodeIds: new Set(), edgeIds: new Set() };
  const nodeIds = new Set([selection.id]);
  for (const e of data.edges) {
    if (!edgeIds.has(e.id)) continue;
    nodeIds.add(e.head);
    nodeIds.add(e.tail);
  }
  return { nodeIds, edgeIds };
}
