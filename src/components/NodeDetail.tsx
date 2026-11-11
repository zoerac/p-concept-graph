import { useGraph } from '../context/GraphContext';
import { POLARITY_COLOR } from './Edge';

export default function NodeDetail({ nodeId }: { nodeId: string }) {
  const { data, toggleEdge } = useGraph();
  const node = data.nodes.find((n) => n.id === nodeId);
  const edges = data.edges.filter((e) => e.head === nodeId || e.tail === nodeId);
  const label = (id: string) => data.nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">{node?.label ?? nodeId}</h2>
      <div className="mt-1 text-[13px] text-neutral-500">共 {edges.length} 条关联边</div>
      <div className="mt-3 flex flex-col gap-2">
        {edges.map((e) => (
          <button
            key={e.id}
            type="button"
            data-testid="edge-list-item"
            onClick={() => toggleEdge(e.id)}
            className="relative rounded-lg bg-white px-4 py-2.5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:bg-neutral-50"
          >
            <span
              className="absolute inset-y-0 left-0 w-[3px] rounded-l-lg"
              style={{ backgroundColor: POLARITY_COLOR[e.polarity] }}
            />
            <div className="text-[13px] text-neutral-800">
              {label(e.head)} — {label(e.tail)}
            </div>
            <div className="mt-0.5 text-[11px] text-neutral-500">
              <span style={{ color: POLARITY_COLOR[e.polarity] }}>{e.polarity}</span> · {e.evidence.length} 条证据
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
