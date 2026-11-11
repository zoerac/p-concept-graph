import type { Evidence } from '../types/graph';

export const INITIAL_VISIBLE = 3;
export const EXPAND_THRESHOLD = 5;

export function groupEvidence(
  evidence: Evidence[],
): Array<{ paper: string; items: Evidence[] }> {
  const order: string[] = [];
  const byPaper = new Map<string, Evidence[]>();
  for (const e of evidence) {
    if (!byPaper.has(e.paper)) {
      byPaper.set(e.paper, []);
      order.push(e.paper);
    }
    byPaper.get(e.paper)!.push(e);
  }
  return order.map((paper) => ({ paper, items: byPaper.get(paper)! }));
}

export function collapseState(count: number): {
  visible: number;
  hidden: number;
  canExpand: boolean;
} {
  const canExpand = count > EXPAND_THRESHOLD;
  const visible = canExpand ? INITIAL_VISIBLE : count;
  return { visible, hidden: count - visible, canExpand };
}
