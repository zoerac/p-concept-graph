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
