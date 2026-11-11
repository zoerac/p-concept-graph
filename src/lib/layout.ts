import type { GraphNode } from '../types/graph';

export const VIEW_W = 1000;
export const VIEW_H = 600;
const PAD_X = 80;
const USABLE_W = 840;
const PAD_TOP = 60;
const USABLE_H = 480;
const BOX_H = 100;
const BOX_PAD_X = 20;

export const LAYER_ORDER = ['property', 'metric', 'p_state'] as const;

export const LAYER_FILL: Record<string, string> = {
  property: '#eef4fb',
  metric: '#f3f0fa',
  p_state: '#eef8f0',
};

export const LAYER_LABEL: Record<string, string> = {
  property: '土壤性质',
  metric: '综合指标',
  p_state: 'P 形态',
};

export function toScreen({ x, y }: { x: number; y: number }) {
  return { cx: PAD_X + x * USABLE_W, cy: PAD_TOP + y * USABLE_H };
}

export function layerBox(
  nodes: GraphNode[],
  layer: string,
): { x: number; y: number; width: number; height: number } | null {
  const own = nodes.filter((n) => n.layer === layer);
  if (own.length === 0) return null;
  const xs = own.map((n) => toScreen(n).cx);
  const cy = toScreen(own[0]).cy;
  const clamp = (v: number) => Math.min(Math.max(v, 0), VIEW_W);
  const x0 = clamp(Math.min(...xs) - BOX_PAD_X);
  const x1 = clamp(Math.max(...xs) + BOX_PAD_X);
  const y = cy - BOX_H / 2;
  return { x: x0, y, width: x1 - x0, height: BOX_H };
}
