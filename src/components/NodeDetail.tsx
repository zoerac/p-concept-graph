import { useGraph } from '../context/GraphContext';

const POLARITY_COLOR: Record<string, string> = {
  '+': '#2e7d32',
  '-': '#c62828',
  '0': '#9e9e9e',
};
const POLARITY_LABEL: Record<string, string> = {
  '+': '正相关',
  '-': '负相关',
  '0': '方向未定',
};

export default function NodeDetail() {
  const { data, selection, setSelection } = useGraph();
  if (selection.type !== 'node') return null;

  const node = data.nodes.find((n) => n.id === selection.id);
  if (!node) return null;

  const edges = data.edges.filter(
    (e) => e.head === node.id || e.tail === node.id,
  );

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 4 }}>
        {node.label}
      </h2>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        {edges.length} 条关联边
      </p>

      {edges.map((edge) => {
        const other = edge.head === node.id
          ? data.nodes.find((n) => n.id === edge.tail)
          : data.nodes.find((n) => n.id === edge.head);
        const color = POLARITY_COLOR[edge.polarity];
        return (
          <div
            key={edge.id}
            onClick={() => setSelection({ type: 'edge', id: edge.id })}
            style={{
              background: '#fff',
              border: '1px solid #e8e8e8',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 8,
              cursor: 'pointer',
              borderLeft: `4px solid ${color}`,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#f5f5f5')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#fff')}
          >
            <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>
              {node.label} — {other?.label ?? edge.tail}
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              <span style={{ color, fontWeight: 600 }}>{edge.polarity}</span>
              <span style={{ color: '#888', marginLeft: 6 }}>{POLARITY_LABEL[edge.polarity]}</span>
              <span style={{ color: '#aaa', marginLeft: 10 }}>{edge.evidence.length} 条证据</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
