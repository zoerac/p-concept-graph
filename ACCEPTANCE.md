# v2 验收记录（2026-11-11）

验证环境：`npm run dev`（http://localhost:5173），生产构建 `npm run build`。

| # | 验收项（spec §8） | 结果 | 证据 |
|---|---|---|---|
| 1 | 布局与 v1 一致：三层顺序、层内左右顺序、边连接关系 | 结构一致（自动化断言） | `src/components/GraphCanvas.test.tsx`：17 节点 / 50 边；层框 y≥0 且 y+h≤600；`src/lib/layout.test.ts`：层序自上而下 property→metric→p_state。**绝对像素位置有偏移**，见下方说明，并排比对需按相对位置。 |
| 2 | 遮挡问题：`sorption_capacity` 标签不被边遮挡；`Fe/Al oxides (oxalate-extractable)` hover 可读全名 | 通过 | 坐标映射留内边距 `cx=80+x*840`、`cy=60+y*480`（`src/lib/layout.ts`）；标签 18 字符截断 + `<title>` 全名（`GraphCanvas.test.tsx` 第 3 例）。节点最后渲染，压在边之上。 |
| 3 | 证据卡片化：白底圆角阴影、按论文分组可折叠 | 通过 | `EvidenceCard.tsx`：`rounded-lg`+`shadow-[0_1px_3px_rgba(0,0,0,0.1)]`+`px-4 py-3`；`Sidebar.test.tsx` 第 3/5 例。 |
| 4 | 交互流畅：点 pH → 10 条边；点边 → 直接切证据；点空白 → 回图例 | 通过 | `src/App.test.tsx` 端到端用例走完整循环，断言无残留 dimmed。 |
| 5 | 43 条证据的边不卡顿、默认折叠 | 通过 | `Sidebar.test.tsx` 第 4 例：初始渲染卡片数 < 43，点击「展开更多」后增加；`collapseState(43)={visible:3,hidden:40}`。 |

## 构建体积（实测）

```
dist/index.html                 0.47 kB │ gzip:  0.33 kB
dist/assets/index-*.css         7.60 kB │ gzip:  2.49 kB
dist/assets/index-*.js        309.76 kB │ gzip: 89.90 kB   ← 目标 < 500 KB
```

## 与 spec 的显式偏离

spec §3 的 `screenX = x*1000` / `screenY = y*600` 在 v2 中改为带内边距的映射（`80 + x*840` / `60 + y*480`）。原因：按原式坐标 0 与 1 落在画布边界上，`property` 层背景框 y=-90 整块被裁、顶部节点只剩半截、最左最右节点各被削一半。层序与层内左右顺序不变。

## 未在自动化中覆盖（需人工过目）

- 与 v1 `index.html` 的并排像素级比对。
- 真实浏览器下的 hover 观感（加粗、tooltip 延迟）。
- 1100px 宽窗口下的并排布局观感。

## 筛选面板（2026-11-12）

| # | 验收项 | 结果 | 证据 |
|---|---|---|---|
| 1 | 默认视图 | 通过：50 条边 / 17 个节点 | `src/components/GraphCanvas.test.tsx`：`renders one node group per graph node and one line per edge`；`src/App.test.tsx`：`filters the canvas down to negative edges from the panel` 初始计数。 |
| 2 | 极性筛选 | 通过：仅 `-` 19/14、仅 `+` 22/15、仅 `0` 9/11、`+`&`-` 41/16 | `src/lib/filter.test.ts`：`visibleSets / filterVisibleData` 参数化用例 `negative only`、`positive only`、`unspecified only`、`positive and negative`。 |
| 3 | 证据下限 | 通过：≥2 为 34/17、≥3 为 23/15、≥5 为 15/12、`-` 且 ≥5 为 4/6 | `src/lib/filter.test.ts`：参数化用例 `all >=2`、`all >=3`、`all >=5`、`negative >=5`；筛选卡交互由 `src/components/FilterPanel.test.tsx`：`applies the evidence floor from the select` 覆盖。 |
| 4 | 筛选为隐藏 | 通过：隐藏边不在 DOM 中 | `src/components/GraphCanvas.test.tsx`：`does not render hidden edges at all (no faded leftovers)`。 |
| 5 | 层框几何固定 | 通过：筛选前后 x/y/width/height 快照相等 | `src/components/GraphCanvas.test.tsx`：`keeps layer boxes pinned to the full layout under any filter`。 |
| 6 | 筛掉选中项后回 idle | 通过：context 同步清空；端到端图例恢复 | `src/context/GraphContext.test.tsx`：`clears a selection that the new filter hides`；`src/App.test.tsx`：`drops the selection when the filtered edge disappears`。 |
| 7 | 节点详情隐藏数按节点统计 | 通过：ph 显示 6 条可见 / 隐藏 4 条；qmax 三条全可见且不显示隐藏行 | `src/components/Sidebar.test.tsx`：`lists only visible edges and reports this node's own hidden count`、`does not report a hidden count for a node whose edges all survive`。 |
| 8 | 全关为空图且可恢复 | 通过：0/50、提示文案、重置按钮可用 | `src/components/FilterPanel.test.tsx`：`allows an all-off state and states it plainly`、`resets everything with the reset button`；`src/components/GraphCanvas.test.tsx`：`shows a hint instead of a blank canvas when nothing matches`；`src/App.test.tsx`：`drops the selection when the filtered edge disappears`。 |
| 9 | 视觉、依赖与体积 | 通过：侧栏为固定筛选卡 + 独立滚动详情卡；未增加依赖；JS gzip 90.97 kB（<100 KB） | `src/components/Sidebar.tsx`、`src/components/FilterPanel.tsx`；`npm run build` 实测；`package.json` dependencies 未变。 |
| 10 | 质量门 | 通过：81/81 测试、`npx tsc -b` 零错误、`npm run lint` 无 error、`npm run build` 成功 | `npx vitest run`、`npx tsc -b`、`npm run lint`、`npm run build`。 |

筛选面板实现后全套测试从原 39 项增至 81 项。lint 输出 4 条 warning（Fast Refresh 导出与测试 hook 依赖提示），无 error。
