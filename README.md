# 土壤磷素概念图 · 交互式网页

把 `graph_data.json` 里的 17 个节点、50 条无向关联边、290 条文献证据渲染成一个可点击的概念图。React + TypeScript + Vite，数据构建期冻结，运行时零网络请求。

## 快速开始

需要 Node.js 18 或更高版本。

```bash
npm install
npm run dev
```

打开 http://localhost:5173 。

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发模式，热重载 |
| `npm run build` | 生成静态站点到 `dist/`（gzip 后约 90 KB） |
| `npm run preview` | 本地预览 `dist/` 构建产物 |
| `npm test` | 运行 39 个单元/集成测试 |

`dist/` 是纯静态文件，丢到任何静态服务器（GitHub Pages、Nginx、`python -m http.server`）都能直接跑。

## 怎么用

- **点节点**：高亮该节点和它的所有关联边，右侧栏列出这些边。
- **点边**：右侧栏显示该边的证据卡片，按论文分组。每组 5 条以内全展示，超过 5 条先显示 3 条，点「展开更多」看剩下的。
- **再点一次**已选中的节点或边：取消选中。
- **点空白处**：清除选中，回到图例。
- **悬停长标签节点**（例如 `Fe/Al oxides (oxalate-extractable)`）：浏览器原生 tooltip 显示完整名称。

极性配色：绿 `+` 正相关，红 `-` 负相关，灰 `0` 方向未定。

## 目录结构

```
src/
├── App.tsx                 # 整体布局：画布 + 右侧栏
├── lib/                    # 纯逻辑，都有单测
│   ├── layout.ts           # 归一化坐标 → 画布像素，层背景框
│   ├── highlight.ts        # 邻接索引，选中态高亮集合
│   └── evidence.ts         # 证据按论文分组、折叠策略
├── components/
│   ├── GraphCanvas.tsx     # SVG 画布：层框 + 边 + 节点
│   ├── Node.tsx / Edge.tsx # 单个节点 / 单条边（含透明宽命中区）
│   ├── Sidebar.tsx         # 右侧栏，按选中态切换
│   ├── NodeDetail.tsx      # 节点详情：关联边列表
│   ├── EdgeDetail.tsx      # 边详情：证据卡片
│   └── EvidenceCard.tsx    # 单条证据
├── context/GraphContext.tsx # 选中态（节点/边互斥）
├── data/graph_data.json    # 冻结数据，勿改
└── types/graph.ts          # 类型定义
```

## 坐标映射

数据里的 `x`、`y` 归一化到 `[0, 1]`，映射到 `viewBox="0 0 1000 600"`：

```
cx = 80 + x * 840
cy = 60 + y * 480
```

水平和垂直都留了内边距。直接乘 1000/600 会让坐标 0 和 1 落在画布边界上，最外层节点被切掉一半、顶层背景框整个被裁。

## 数据格式

`src/data/graph_data.json` 是只读输入，不要手改：

```json
{
  "nodes": [{ "id", "label", "layer", "x", "y" }],
  "edges": [{ "id", "head", "tail", "polarity", "mechanism_hint", "evidence": [
    { "unit_id", "quote", "paper" }
  ]}]
}
```

`layer` 取 `property` / `metric` / `p_state`；`polarity` 取 `+` / `-` / `0`；`quote` 原样渲染，不截断。

## 验收状态

- 39/39 测试通过，`tsc` 零错误
- 生产构建 gzip 后 89 KB
- 详见 [`ACCEPTANCE.md`](./ACCEPTANCE.md)，其中列了三项仍需人工过目的检查
