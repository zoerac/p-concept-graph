import { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import EvidenceCard from './EvidenceCard';
import type { Evidence } from '../types/graph';

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

function PaperGroup({ paper, items }: { paper: string; items: Evidence[] }) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? items : items.slice(0, 3);
  const hasMore = items.length > 3 && !showAll;

  return (
    <div
      style={{
        background: '#f7f7f7',
        borderRadius: 8,
        padding: '10px 12px',
        marginBottom: 10,
      }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          padding: 0,
        }}
      >
        <span style={{ fontSize: 13, color: '#555' }}>
          {expanded ? '▾' : '▸'}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>
          📄 {paper}
        </span>
        <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>
          ({items.length} 条)
        </span>
      </button>

      {expanded && (
        <div>
          {visible.map((ev) => (
            <EvidenceCard key={ev.unit_id + ev.quote.slice(0, 20)} evidence={ev} />
          ))}
          {hasMore && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                marginTop: 8,
                fontSize: 12,
                color: '#666',
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: 6,
                padding: '4px 10px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              展开更多 ({items.length - 3} 条)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function EdgeDetail() {
  const { data, selection } = useGraph();
  if (selection.type !== 'edge') return null;

  const edge = data.edges.find((e) => e.id === selection.id);
  if (!edge) return null;

  const headNode = data.nodes.find((n) => n.id === edge.head);
  const tailNode = data.nodes.find((n) => n.id === edge.tail);
  const color = POLARITY_COLOR[edge.polarity];

  // Group evidence by paper
  const groups: Map<string, Evidence[]> = new Map();
  for (const ev of edge.evidence) {
    if (!groups.has(ev.paper)) groups.set(ev.paper, []);
    groups.get(ev.paper)!.push(ev);
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color, marginBottom: 6, lineHeight: 1.3 }}>
        {headNode?.label ?? edge.head} — {tailNode?.label ?? edge.tail}
      </h2>
      <div style={{ fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: '#888' }}>极性：</span>
        <span style={{ color, fontWeight: 600 }}>
          {edge.polarity}（{POLARITY_LABEL[edge.polarity]}）
        </span>
      </div>
      {edge.mechanism_hint && (
        <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
          <span style={{ color: '#888' }}>机制提示：</span>
          {edge.mechanism_hint.split(';')[0].trim()}
        </div>
      )}
      <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        共 {edge.evidence.length} 条证据
      </div>

      {[...groups.entries()].map(([paper, items]) => (
        <PaperGroup key={paper} paper={paper} items={items} />
      ))}
    </div>
  );
}
