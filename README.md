# P 概念图交互式网页 v2

React + TypeScript + Vite 构建的土壤磷素概念关联图交互式演示。

## 安装与运行

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev
# 访问 http://localhost:5173

# 生产构建
npm run build
# 产物在 dist/，gzip 后约 90 KB

# 预览构建产物
npm run preview

# 测试（36 个用例）
npm test
```

## 项目结构

```
src/
├── App.tsx                    # 主入口，布局
├── context/
│   └── GraphContext.tsx       # 全局状态（选中节点/边）
├── lib/                       # 纯逻辑（有单测）
│   ├── layout.ts              # 坐标映射与层背景框
│   ├── highlight.ts           # 邻接索引与高亮集合
│   └── evidence.ts            # 证据分组与折叠策略
├── components/
│   ├── GraphCanvas.tsx        # SVG 画布（节点 + 边 + 层背景框）
│   ├── Node.tsx               # 单个节点
│   ├── Edge.tsx               # 单条边（含透明宽命中区）
│   ├── Sidebar.tsx            # 右侧栏容器
│   ├── NodeDetail.tsx         # 节点详情（关联边列表）
│   ├── EdgeDetail.tsx         # 边详情（证据卡片，按论文分组）
│   └── EvidenceCard.tsx       # 单条证据卡片
├── data/
│   └── graph_data.json        # 预处理数据（17 节点，50 边，290 证据）
└── types/
    └── graph.ts               # TypeScript 类型定义
```

## 交互说明

- **点击节点**：高亮该节点及其所有关联边，右侧栏显示边列表。
- **点击边**（画布或右侧栏列表）：高亮该边，右侧栏显示证据卡片（按论文分组）。
- **点击空白**：取消选中，恢复初始状态。
- **Hover 节点**：SVG `<title>` 显示完整标签（浏览器原生 tooltip）。

## 数据

数据为构建期冻结的 `src/data/graph_data.json`（17 节点 / 50 边 / 290 条证据），运行时零网络请求。**不要修改此文件**，格式：

```json
{
  "nodes": [{ "id", "label", "layer", "x", "y" }],
  "edges": [{ "id", "head", "tail", "polarity", "mechanism_hint", "evidence": [{ "unit_id", "quote", "paper" }] }]
}
```
