import { useGraph } from '../context/GraphContext';
import NodeDetail from './NodeDetail';
import EdgeDetail from './EdgeDetail';

function DefaultPanel() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 16 }}>
        P 概念图说明
      </h2>
      <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 16 }}>
        本图展示土壤磷素相关概念间的无向关联关系。
      </p>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 10 }}>
          极性含义
        </div>
        {[
          { symbol: '+', label: '正相关', color: '#2e7d32' },
          { symbol: '-', label: '负相关', color: '#c62828' },
          { symbol: '0', label: '方向未定', color: '#9e9e9e' },
        ].map(({ symbol, label, color }) => (
          <div key={symbol} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span
              style={{
                display: 'inline-block',
                width: 28,
                height: 4,
                borderRadius: 2,
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: '#555' }}>
              <strong style={{ color }}>{symbol}</strong> {label}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 10 }}>
          图层
        </div>
        {[
          { key: 'property', label: '土壤性质', fill: '#eef4fb' },
          { key: 'metric', label: '综合指标', fill: '#f3f0fa' },
          { key: 'p_state', label: 'P 形态', fill: '#eef8f0' },
        ].map(({ key, label, fill }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                borderRadius: 3,
                background: fill,
                border: '1px solid #ccc',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: '#555' }}>{label}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>
        点击节点查看关联边列表，点击边查看证据详情，点击空白处取消选中。
      </p>
    </div>
  );
}

export default function Sidebar() {
  const { selection } = useGraph();

  return (
    <div
      style={{
        width: 420,
        flexShrink: 0,
        height: '100vh',
        overflowY: 'auto',
        background: '#fafafa',
        borderLeft: '1px solid #e0e0e0',
        padding: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {selection.type === 'none' && <DefaultPanel />}
      {selection.type === 'node' && <NodeDetail />}
      {selection.type === 'edge' && <EdgeDetail />}
    </div>
  );
}
