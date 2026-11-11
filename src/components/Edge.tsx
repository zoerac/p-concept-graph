import { useGraph } from '../context/GraphContext';
import type { GraphEdge } from '../types/graph';

const POLARITY_COLOR: Record<string, string> = {
  '+': '#2e7d32',
  '-': '#c62828',
  '0': '#9e9e9e',
};

interface Props {
  edge: GraphEdge;
  headPos: { x: number; y: number };
  tailPos: { x: number; y: number };
  dimmed: boolean;
}

export default function Edge({ edge, headPos, tailPos, dimmed }: Props) {
  const { selection, setSelection } = useGraph();
  const selected = selection.type === 'edge' && selection.id === edge.id;

  const x1 = headPos.x * 1000;
  const y1 = headPos.y * 600;
  const x2 = tailPos.x * 1000;
  const y2 = tailPos.y * 600;

  const opacity = dimmed ? 0.1 : selected ? 1 : 0.3;
  const color = POLARITY_COLOR[edge.polarity] ?? '#9e9e9e';

  return (
    <g style={{ opacity }}>
      {/* invisible wide hitbox */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="transparent"
        strokeWidth={12}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          setSelection({ type: 'edge', id: edge.id });
        }}
      />
      {/* visible line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={selected ? 3 : 1.5}
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
}
