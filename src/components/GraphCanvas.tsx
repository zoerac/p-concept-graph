import { useMemo, useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { highlightSets } from '../lib/highlight';
import { LAYER_FILL, LAYER_LABEL, LAYER_ORDER, VIEW_H, VIEW_W, layerBox } from '../lib/layout';
import Edge from './Edge';
import Node from './Node';

export default function GraphCanvas() {
  const { data, selection, toggleNode, toggleEdge, clear } = useGraph();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  const byId = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data.nodes]);
  const sets = useMemo(() => highlightSets(data, selection), [data, selection]);
  const visible = (ids: Set<string> | null, id: string) => ids === null || ids.has(id);

  const selectedEdgeId = selection.type === 'edge' ? selection.id : null;
  const orderedEdges = [
    ...data.edges.filter((e) => e.id !== selectedEdgeId),
    ...data.edges.filter((e) => e.id === selectedEdgeId),
  ];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-full w-full"
      onClick={clear}
      role="presentation"
    >
      {LAYER_ORDER.map((layer) => {
        const box = layerBox(data.nodes, layer);
        if (!box) return null;
        return (
          <g key={layer} pointerEvents="none">
            <rect
              data-layer={layer}
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              rx={12}
              fill={LAYER_FILL[layer]}
              stroke="#d0d0d0"
              strokeDasharray="6 4"
            />
            <text x={box.x + 10} y={box.y + 18} fontSize={12} fill="#555" fontWeight={600}>
              {LAYER_LABEL[layer]}
            </text>
          </g>
        );
      })}

      {orderedEdges.map((edge) => {
        const head = byId.get(edge.head);
        const tail = byId.get(edge.tail);
        if (!head || !tail) return null;
        return (
          <Edge
            key={edge.id}
            edge={edge}
            head={head}
            tail={tail}
            dimmed={!visible(sets.edgeIds, edge.id)}
            active={edge.id === selectedEdgeId}
            top={edge.id === selectedEdgeId}
            hovered={hoveredEdge === edge.id}
            onHover={setHoveredEdge}
            onClick={() => toggleEdge(edge.id)}
          />
        );
      })}

      {data.nodes.map((node) => {
        const hovered = hoveredNode === node.id;
        return (
          <Node
            key={node.id}
            node={node}
            dimmed={!visible(sets.nodeIds, node.id)}
            hovered={hovered}
            onHover={setHoveredNode}
            onClick={() => toggleNode(node.id)}
          />
        );
      })}
    </svg>
  );
}
