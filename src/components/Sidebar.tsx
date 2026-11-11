import { useGraph } from '../context/GraphContext';
import EdgeDetail from './EdgeDetail';
import NodeDetail from './NodeDetail';
import { POLARITY_COLOR } from './Edge';

function Legend() {
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">P 概念图说明</h2>
      <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">
        边表示无向关联，极性含义：
      </p>
      <div className="mt-2 flex flex-col gap-1.5 text-[13px]">
        {[
          ['+', '正相关'],
          ['-', '负相关'],
          ['0', '方向未定'],
        ].map(([p, text]) => (
          <div key={p} className="flex items-center gap-2">
            <span className="h-[3px] w-6 rounded" style={{ backgroundColor: POLARITY_COLOR[p] }} />
            <span style={{ color: POLARITY_COLOR[p] }}>{p}</span>
            <span className="text-neutral-700">{text}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-neutral-500">点击节点或边查看详情。</p>
    </div>
  );
}

export default function Sidebar() {
  const { data, selection } = useGraph();
  const edge = selection.type === 'edge' ? data.edges.find((e) => e.id === selection.id) : undefined;

  return (
    <aside className="w-[420px] shrink-0 overflow-y-auto border-l border-neutral-200 bg-[#fafafa] p-5">
      {selection.type === 'none' && <Legend />}
      {selection.type === 'node' && <NodeDetail nodeId={selection.id} />}
      {selection.type === 'edge' &&
        (edge ? <EdgeDetail edge={edge} /> : <p className="text-[13px] text-neutral-500">未找到该边</p>)}
    </aside>
  );
}
