import type { Evidence } from '../types/graph';

interface Props {
  evidence: Evidence;
}

export default function EvidenceCard({ evidence }: Props) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '12px 16px',
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontFamily: '"Monaco","Courier New",monospace',
          fontSize: 11,
          color: '#888',
          marginBottom: 6,
        }}
      >
        {evidence.unit_id}
      </div>
      <div style={{ fontSize: 14, fontStyle: 'italic', color: '#333', lineHeight: 1.55 }}>
        "{evidence.quote}"
      </div>
    </div>
  );
}
