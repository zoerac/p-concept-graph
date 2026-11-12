import { useGraph } from '../context/GraphContext';
import { isDefaultFilter, MIN_EVIDENCE_OPTIONS, polarityCounts } from '../lib/filter';
import type { Polarity } from '../types/graph';
import { POLARITY_COLOR } from './Edge';

const POLARITIES: Polarity[] = ['+', '-', '0'];
const POLARITY_LABEL: Record<Polarity, string> = { '+': '正相关', '-': '负相关', '0': '方向未定' };

export default function FilterPanel() {
  const { data, visibleData, filter, togglePolarity, setMinEvidence, resetFilter } = useGraph();
  const counts = polarityCounts(data);

  return (
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-[13px] font-semibold text-neutral-900">筛选</h2>
        <span data-testid="visible-count" className="text-[11px] text-neutral-500">
          {visibleData.edges.length}/{data.edges.length}
        </span>
        {!isDefaultFilter(filter) && (
          <button
            type="button"
            data-testid="reset-filter"
            onClick={resetFilter}
            className="ml-auto text-[11px] text-neutral-500 hover:text-neutral-800"
          >
            重置
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {POLARITIES.map((polarity) => {
          const checked = filter.polarities.includes(polarity);
          return (
            <button
              key={polarity}
              type="button"
              role="switch"
              aria-checked={checked}
              data-testid={`polarity-chip-${polarity}`}
              onClick={() => togglePolarity(polarity)}
              className={`rounded-md border px-2 py-1 text-xs ${checked ? '' : 'border-neutral-200 bg-white text-neutral-400'}`}
              style={checked ? {
                borderColor: POLARITY_COLOR[polarity],
                color: POLARITY_COLOR[polarity],
                backgroundColor: `${POLARITY_COLOR[polarity]}1A`,
              } : undefined}
            >
              {polarity} {POLARITY_LABEL[polarity]} {counts[polarity]}
            </button>
          );
        })}
      </div>
      <label htmlFor="min-evidence-select" className="mt-2 flex items-center gap-2 text-[12px] text-neutral-600">
        证据下限
        <select
          id="min-evidence-select"
          data-testid="min-evidence-select"
          value={String(filter.minEvidence)}
          onChange={(event) => setMinEvidence(Number(event.target.value))}
          className="rounded border border-neutral-200 bg-white px-2 py-1 text-[12px] text-neutral-700"
        >
          {MIN_EVIDENCE_OPTIONS.map((n) => (
            <option key={n} value={String(n)}>{n === 0 ? '全部证据' : `≥${n} 条`}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
