import type { Taxon } from "../types";

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportCsv(rows: Taxon[], filename = "ichnosen-taxons.csv") {
  if (rows.length === 0) return;
  const columns = Object.keys(rows[0]) as (keyof Taxon)[];
  const header = columns.join(",");
  const lines = rows.map((row) => columns.map((c) => csvEscape(row[c])).join(","));
  downloadBlob(filename, [header, ...lines].join("\n"), "text/csv;charset=utf-8");
}

export function exportJson(rows: Taxon[], filename = "ichnosen-taxons.json") {
  downloadBlob(filename, JSON.stringify(rows, null, 2), "application/json;charset=utf-8");
}
