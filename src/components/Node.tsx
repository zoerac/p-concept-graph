import { useGraph } from '../context/GraphContext';
import type { GraphNode } from '../types/graph';

interface Props {
  node: GraphNode;
  dimmed: boolean;
}

const R = 7;

export default function Node({ node, dimmed }: Props) {
  const { selection, setSelection } = useGraph();
  const cx = node.x * 1000;
  const cy = node.y * 600;
  const selected = selection.type === 'node' && selection.id === node.id;

  // Truncate label visually at ~120px (~14 chars); full label via <title>.
  const maxChars = 18;
  const short =
    node.label.length > maxChars ? node.label.slice(0, maxChars - 1) + '…' : node.label;

  return (
    <g
      style={{ cursor: 'pointer', opacity: dimmed ? 0.1 : 1 }}
      onClick={(e) => {
        e.stopPropagation();
        setSelection({ type: 'node', id: node.id });
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill={selected ? '#333' : '#fff'}
        stroke={selected ? '#333' : '#555'}
        strokeWidth={selected ? 3 : 1.5}
      />
      <text
        x={cx}
        y={cy - R - 4}
        textAnchor="middle"
        fontSize={12}
        fill="#333"
        fontWeight={selected ? 700 : 400}
        style={{ pointerEvents: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        {short}
        <title>{node.label}</title>
      </text>
    </g>
  );
}
