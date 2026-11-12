import { useGraph } from '../context/GraphContext';
import EdgeDetail from './EdgeDetail';
import NodeDetail from './NodeDetail';
import FilterPanel from './FilterPanel';

function Legend() {
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">P 概念图说明</h2>
      <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">
        点节点高亮关联边，点边查看证据；上方开关可只显示某类关系。
      </p>
      <p className="mt-4 text-[13px] text-neutral-500">数据集：17 个节点 · 50 条边 · 290 条证据</p>
    </div>
  );
}

export default function Sidebar() {
  const { data, selection } = useGraph();
  const edge = selection.type === 'edge' ? data.edges.find((e) => e.id === selection.id) : undefined;

  return (
    <aside className="flex w-[420px] shrink-0 flex-col gap-3 border-l border-neutral-200 bg-[#fafafa] p-4">
      <section data-testid="filter-card" className="shrink-0 rounded-lg bg-white p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <FilterPanel />
      </section>
      <section data-testid="detail-card" className="min-h-0 flex-1 overflow-y-auto rounded-lg bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {selection.type === 'none' && <Legend />}
        {selection.type === 'node' && <NodeDetail nodeId={selection.id} />}
        {selection.type === 'edge' &&
          (edge ? <EdgeDetail edge={edge} /> : <p className="text-[13px] text-neutral-500">未找到该边</p>)}
      </section>
    </aside>
  );
}
