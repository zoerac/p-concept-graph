import { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { collapseState, groupEvidence } from '../lib/evidence';
import type { GraphEdge } from '../types/graph';
import EvidenceCard from './EvidenceCard';
import { POLARITY_COLOR } from './Edge';

const POLARITY_TEXT: Record<string, string> = {
  '+': '正相关',
  '-': '负相关',
  '0': '方向未定',
};

function PaperGroup({ paper, items }: { paper: string; items: GraphEdge['evidence'] }) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { visible, hidden, canExpand } = collapseState(items.length);
  const shown = expanded ? items.length : visible;

  return (
    <div data-testid="paper-group" className="mt-3 rounded-lg bg-neutral-100 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded px-1 py-0.5 text-left text-[13px] font-medium text-neutral-700 hover:bg-neutral-200"
      >
        <span>{open ? '▾' : '▸'}</span>
        <span>{paper}</span>
        <span className="text-neutral-500">({items.length} 条)</span>
      </button>
      {open && (
        <>
          {items.slice(0, shown).map((e) => (
            <EvidenceCard key={e.unit_id} evidence={e} />
          ))}
          {canExpand && !expanded && (
            <button
              type="button"
              data-testid="expand-group"
              onClick={() => setExpanded(true)}
              className="mt-2 rounded-md px-2 py-1 text-xs text-blue-700 hover:bg-neutral-200"
            >
              展开更多 ({hidden} 条)
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function EdgeDetail({ edge }: { edge: GraphEdge }) {
  const { data } = useGraph();
  const label = (id: string) => data.nodes.find((n) => n.id === id)?.label ?? id;
  const color = POLARITY_COLOR[edge.polarity];

  return (
    <div>
      <h2 className="text-lg font-bold" style={{ color }}>
        {label(edge.head)} — {label(edge.tail)}
      </h2>
      <div className="mt-2 text-[13px] text-neutral-600">
        极性：
        <span style={{ color }} className="font-semibold">
          {edge.polarity} {POLARITY_TEXT[edge.polarity]}
        </span>
      </div>
      {edge.mechanism_hint && (
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-700">{edge.mechanism_hint}</p>
      )}
      <div className="mt-3 text-[13px] font-medium text-neutral-800">共 {edge.evidence.length} 条证据</div>
      {groupEvidence(edge.evidence).map((g) => (
        <PaperGroup key={g.paper} paper={g.paper} items={g.items} />
      ))}
    </div>
  );
}
