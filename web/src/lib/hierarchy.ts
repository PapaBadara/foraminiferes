import type { Taxon } from "../types";

interface TreeNode {
  id: string;
  children?: TreeNode[];
  value?: number;
}

/** Builds a nested count tree (for sunburst/treemap) by successively grouping on `keys`. */
export function buildTree(rows: Taxon[], keys: (keyof Taxon)[]): TreeNode[] {
  if (keys.length === 0) return [];
  const [key, ...rest] = keys;
  const groups = new Map<string, Taxon[]>();
  rows.forEach((row) => {
    const raw = row[key];
    if (raw === null || raw === undefined) return;
    const k = String(raw);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(row);
  });

  return Array.from(groups.entries()).map(([id, subrows]) => {
    if (rest.length === 0) {
      return { id, value: subrows.length };
    }
    return { id, children: buildTree(subrows, rest) };
  });
}
