import { toScreen } from '../lib/layout';
import type { GraphNode } from '../types/graph';

const MAX_CHARS = 18;

export const truncate = (label: string) =>
  label.length > MAX_CHARS ? `${label.slice(0, MAX_CHARS)}…` : label;

const wrap = (label: string) => {
  const text = truncate(label);
  return text.match(/.{1,12}(\s|$)|.{1,12}/g)!.map((s) => s.trim());
};

export default function Node({
  node,
  dimmed,
  hovered,
  onHover,
  onClick,
}: {
  node: GraphNode;
  dimmed: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  const { cx, cy } = toScreen(node);
  return (
    <g
      data-node-id={node.id}
      data-dimmed={dimmed ? 'true' : undefined}
      opacity={dimmed ? 0.1 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer"
    >
      <title>{node.label}</title>
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="#fff"
        stroke="#333"
        strokeWidth={hovered ? 3 : 2}
        className="transition-[stroke-width]"
      />
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontSize={12}
        fill="#333"
        fontWeight={hovered ? 600 : 400}
      >
        {wrap(node.label).map((line, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}
