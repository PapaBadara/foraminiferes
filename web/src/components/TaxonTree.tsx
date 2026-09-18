import { useState } from "react";
import type { Taxon } from "../types";
import { buildTaxonomyTree } from "../lib/taxonomy";

export function TaxonTree({ rows, onSelect }: { rows: Taxon[]; onSelect: (id: number) => void }) {
  const tree = buildTaxonomyTree(rows);
  const [openOrdres, setOpenOrdres] = useState<Set<string>>(new Set());
  const [openGenres, setOpenGenres] = useState<Set<string>>(new Set());

  function toggle(set: Set<string>, setSet: (s: Set<string>) => void, key: string) {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSet(next);
  }

  return (
    <div
      className="scrollbar-thin"
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        background: "var(--surface-1)",
        padding: 8,
        maxHeight: 560,
        overflowY: "auto",
      }}
    >
      {tree.map((ordreNode) => {
        const ordreOpen = openOrdres.has(ordreNode.ordre);
        return (
          <div key={ordreNode.ordre} style={{ marginBottom: 4 }}>
            <button
              onClick={() => toggle(openOrdres, setOpenOrdres, ordreNode.ordre)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 12px",
                color: "var(--brand-cream)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span>
                {ordreOpen ? "▾" : "▸"} {ordreNode.ordre}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{ordreNode.count}</span>
            </button>

            {ordreOpen && (
              <div style={{ paddingLeft: 20, marginTop: 4 }}>
                {ordreNode.genres.map((genreNode) => {
                  const genreKey = `${ordreNode.ordre}__${genreNode.genre}`;
                  const genreOpen = openGenres.has(genreKey);
                  return (
                    <div key={genreKey} style={{ marginBottom: 2 }}>
                      <button
                        onClick={() => toggle(openGenres, setOpenGenres, genreKey)}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "transparent",
                          border: "none",
                          borderLeft: "2px solid var(--brand-copper)",
                          padding: "6px 10px",
                          color: "var(--text-primary)",
                          fontSize: 13,
                          fontStyle: "italic",
                          cursor: "pointer",
                        }}
                      >
                        <span>
                          {genreOpen ? "▾" : "▸"} {genreNode.genre}
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{genreNode.count}</span>
                      </button>

                      {genreOpen && (
                        <div style={{ paddingLeft: 22 }}>
                          {genreNode.taxa.map((taxon) => (
                            <button
                              key={taxon.id}
                              onClick={() => onSelect(taxon.id)}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                background: "transparent",
                                border: "none",
                                padding: "4px 10px",
                                color: "var(--text-secondary)",
                                fontSize: 13,
                                cursor: "pointer",
                                borderRadius: 6,
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              {taxon.Nom_taxon}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
