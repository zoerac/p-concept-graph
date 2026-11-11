import { toScreen } from '../lib/layout';
import type { GraphEdge, GraphNode } from '../types/graph';

export const POLARITY_COLOR: Record<string, string> = {
  '+': '#2e7d32',
  '-': '#c62828',
  '0': '#9e9e9e',
};

export default function Edge({
  edge,
  head,
  tail,
  dimmed,
  active,
  top,
  hovered,
  onHover,
  onClick,
}: {
  edge: GraphEdge;
  head: GraphNode;
  tail: GraphNode;
  dimmed: boolean;
  active: boolean;
  top: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  const a = toScreen(head);
  const b = toScreen(tail);
  const color = POLARITY_COLOR[edge.polarity];
  const width = active ? 3 : hovered ? 2.2 : 1.5;
  const opacity = dimmed ? 0.1 : active ? 1 : 0.3;
  return (
    <g
      data-edge-id={edge.id}
      data-dimmed={dimmed ? 'true' : undefined}
      data-top={top ? 'true' : undefined}
      className="cursor-pointer"
      onMouseEnter={() => onHover(edge.id)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <line
        x1={a.cx}
        y1={a.cy}
        x2={b.cx}
        y2={b.cy}
        stroke={color}
        strokeWidth={width}
        opacity={opacity}
      />
      <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} stroke="transparent" strokeWidth={12} />
    </g>
  );
}
