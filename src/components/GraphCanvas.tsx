import { useGraph } from '../context/GraphContext';
import Edge from './Edge';
import Node from './Node';

const VW = 1000;
const VH = 600;

const LAYER_Y: Record<string, number> = { property: 0, metric: 0.5, p_state: 1 };
const LAYER_FILL: Record<string, string> = {
  property: '#eef4fb',
  metric: '#f3f0fa',
  p_state: '#eef8f0',
};
const LAYER_LABEL: Record<string, string> = {
  property: '土壤性质',
  metric: '综合指标',
  p_state: 'P 形态',
};

export default function GraphCanvas() {
  const { data, selection, setSelection } = useGraph();

  // Compute which nodes/edges are highlighted vs dimmed
  const selectedNodeId = selection.type === 'node' ? selection.id : null;
  const selectedEdgeId = selection.type === 'edge' ? selection.id : null;

  const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));

  // Edges adjacent to selected node
  const adjacentEdgeIds = selectedNodeId
    ? new Set(data.edges.filter((e) => e.head === selectedNodeId || e.tail === selectedNodeId).map((e) => e.id))
    : null;

  // Nodes adjacent to selected edge
  const selectedEdge = selectedEdgeId ? data.edges.find((e) => e.id === selectedEdgeId) : null;
  const adjacentNodeIds = selectedEdge
    ? new Set([selectedEdge.head, selectedEdge.tail])
    : null;

  const isNodeDimmed = (nodeId: string): boolean => {
    if (selection.type === 'none') return false;
    if (selectedNodeId) return nodeId !== selectedNodeId && !(adjacentEdgeIds && [...adjacentEdgeIds].some((eid) => {
      const e = data.edges.find((x) => x.id === eid);
      return e && (e.head === nodeId || e.tail === nodeId);
    }));
    if (adjacentNodeIds) return !adjacentNodeIds.has(nodeId);
    return false;
  };

  const isEdgeDimmed = (edgeId: string): boolean => {
    if (selection.type === 'none') return false;
    if (selectedNodeId) return !(adjacentEdgeIds && adjacentEdgeIds.has(edgeId));
    if (selectedEdgeId) return edgeId !== selectedEdgeId;
    return false;
  };

  // Build layer boxes from actual node x positions per layer
  const layerGroups = (['property', 'metric', 'p_state'] as const).map((layer) => {
    const nodes = data.nodes.filter((n) => n.layer === layer);
    const xs = nodes.map((n) => n.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const y = LAYER_Y[layer];
    return { layer, minX, maxX, y };
  });

  // Separate selected edge so it renders on top
  const unselectedEdges = data.edges.filter((e) => e.id !== selectedEdgeId);
  const topEdge = selectedEdge ? [selectedEdge] : [];

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%' }}
      onClick={() => setSelection({ type: 'none' })}
    >
      {/* Layer background boxes */}
      {layerGroups.map(({ layer, minX, maxX, y }) => {
        const rx = (minX - 0.05) * VW;
        const ry = (y - 0.15) * VH;
        const rw = (maxX - minX + 0.1) * VW;
        const rh = 120;
        return (
          <g key={layer} style={{ pointerEvents: 'none' }}>
            <rect
              x={rx} y={ry} width={rw} height={rh}
              rx={8} ry={8}
              fill={LAYER_FILL[layer]}
              stroke="#ccc"
              strokeWidth={1}
              strokeDasharray="4"
            />
            <text
              x={rx + 8}
              y={ry + 16}
              fontSize={12}
              fill="#666"
              fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            >
              {LAYER_LABEL[layer]}
            </text>
          </g>
        );
      })}

      {/* Unselected edges first */}
      {unselectedEdges.map((edge) => {
        const head = nodeMap.get(edge.head);
        const tail = nodeMap.get(edge.tail);
        if (!head || !tail) return null;
        return (
          <Edge
            key={edge.id}
            edge={edge}
            headPos={head}
            tailPos={tail}
            dimmed={isEdgeDimmed(edge.id)}
          />
        );
      })}

      {/* Selected edge on top */}
      {topEdge.map((edge) => {
        const head = nodeMap.get(edge.head);
        const tail = nodeMap.get(edge.tail);
        if (!head || !tail) return null;
        return (
          <Edge
            key={edge.id}
            edge={edge}
            headPos={head}
            tailPos={tail}
            dimmed={false}
          />
        );
      })}

      {/* Nodes */}
      {data.nodes.map((node) => (
        <Node key={node.id} node={node} dimmed={isNodeDimmed(node.id)} />
      ))}
    </svg>
  );
}
