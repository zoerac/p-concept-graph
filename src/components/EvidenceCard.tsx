import type { Evidence } from '../types/graph';

export default function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <div
      data-testid="evidence-card"
      className="mt-2 rounded-lg bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
    >
      <div className="font-mono text-[11px] text-neutral-500">{evidence.unit_id}</div>
      <div data-quote className="mt-1 text-sm italic leading-relaxed text-neutral-800">
        {evidence.quote}
      </div>
    </div>
  );
}
