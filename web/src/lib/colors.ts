// Validated categorical palette (see project notes): first 3 slots are
// all-pairs safe (used for Source, shown on the map); all 6 are adjacent-safe
// (used for stacked/grouped bars where spatial adjacency matters).
export const SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
];

export const SERIES_HEX = ["#c5782d", "#2f9e8f", "#7a5fb0", "#c0524f", "#a8932c", "#3d7ab8"];

export const SEQUENTIAL_HEX = ["#3a2c1c", "#6b4a26", "#96612c", "#c5782d", "#e6a355"];

export function colorScaleFor(categories: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  categories.forEach((c, i) => {
    map[c] = SERIES_HEX[i % SERIES_HEX.length];
  });
  return map;
}

/** Caps a category list to the validated 6-slot budget, folding the rest into "Autres". */
export function capCategories<T extends { label: string; value: number }>(
  items: T[],
  max = 6
): T[] {
  if (items.length <= max) return items;
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const kept = sorted.slice(0, max - 1);
  const rest = sorted.slice(max - 1).reduce((sum, i) => sum + i.value, 0);
  return [...kept, { label: "Autres", value: rest } as T];
}
