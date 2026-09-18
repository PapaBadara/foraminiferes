import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ClipboardList,
  Search,
  ListTree,
  Printer,
  Microscope,
  MapPin,
  Clock,
  Compass,
  FileText,
  Waves,
  Globe,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { SectionTitle } from "../components/KpiCard";
import { PageTitle } from "../components/PageTitle";
import { Tabs } from "../components/Tabs";
import { TaxonTree } from "../components/TaxonTree";
import { exportCsv, exportJson } from "../lib/export";
import type { Taxon } from "../types";

const DISPLAY_COLS: (keyof Taxon)[] = [
  "Nom_taxon",
  "Type",
  "Age_géologique",
  "Lieu_découverte",
  "Source",
];

const CLASSIFICATION_FIELDS: (keyof Taxon)[] = ["Règne", "Embranchement", "Classe", "Groupe/Ordre", "Type"];
const LOCATION_FIELDS: (keyof Taxon)[] = ["Lieu_découverte", "Découvreur (auteur taxonomique)", "Auteur_site", "Source"];
const STRATI_FIELDS: (keyof Taxon)[] = ["Age_géologique", "Biozones", "Stratigraphie", "From_m", "To_m"];

export function Catalogue() {
  const { all, filtered } = useData();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [params, setParams] = useSearchParams();

  const directTaxonId = params.get("taxon");
  const directTaxon = directTaxonId ? all.find((t) => String(t.id) === directTaxonId) ?? null : null;
  const directOutsideFilters = !!directTaxon && !filtered.some((t) => t.id === directTaxon.id);

  useEffect(() => {
    if (directTaxon) setSelected(directTaxon.id);
  }, [directTaxonId]);

  const results = useMemo(() => {
    if (!search.trim()) return filtered;
    const q = search.toLowerCase();
    return filtered.filter((row) =>
      Object.values(row).some((v) => v !== null && String(v).toLowerCase().includes(q))
    );
  }, [filtered, search]);

  const detail = directTaxon ?? results.find((r) => r.id === selected) ?? results[0] ?? null;

  function selectFromTree(id: number) {
    setParams({});
    setSelected(id);
  }

  return (
    <div>
      <div className="print-hide">
        <PageTitle icon={ClipboardList}>Catalogue des taxons</PageTitle>
      </div>

      {directOutsideFilters && (
        <p
          className="print-hide"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--brand-copper)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "var(--text-secondary)",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          Fiche ouverte directement depuis la carte — ce taxon est hors des filtres actifs de la barre latérale.{" "}
          <button
            onClick={() => setParams({})}
            style={{ background: "none", border: "none", color: "var(--brand-copper)", cursor: "pointer", padding: 0 }}
          >
            Revenir à la recherche
          </button>
        </p>
      )}

      <div className="print-hide">
        <Tabs
          tabs={[
            {
              label: "Recherche",
              icon: Search,
              content: (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <Search
                        size={16}
                        strokeWidth={1.75}
                        color="var(--text-muted)"
                        style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                        aria-hidden
                      />
                      <input
                        type="text"
                        placeholder="Rechercher un taxon (nom, auteur, description…)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px 10px 40px",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          background: "var(--surface-1)",
                          color: "var(--text-primary)",
                          fontSize: 14,
                        }}
                      />
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, whiteSpace: "nowrap" }}>
                      <strong style={{ color: "var(--brand-cream)" }}>{results.length}</strong> résultats
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <ExportButton label="CSV" onClick={() => exportCsv(results)} />
                      <ExportButton label="JSON" onClick={() => exportJson(results)} />
                    </div>
                  </div>

                  <div
                    className="scrollbar-thin"
                    style={{
                      maxHeight: 320,
                      overflowY: "auto",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      marginBottom: 32,
                    }}
                  >
                    <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "var(--surface-1)", position: "sticky", top: 0 }}>
                          {DISPLAY_COLS.map((col) => (
                            <th
                              key={col}
                              style={{
                                textAlign: "left",
                                padding: "8px 10px",
                                color: "var(--text-secondary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row) => (
                          <tr
                            key={row.id}
                            onClick={() => {
                              setParams({});
                              setSelected(row.id);
                            }}
                            style={{
                              cursor: "pointer",
                              background: row.id === detail?.id ? "var(--surface-2)" : "transparent",
                              borderBottom: "1px solid var(--gridline)",
                            }}
                          >
                            {DISPLAY_COLS.map((col) => (
                              <td
                                key={col}
                                title={row[col] !== null ? String(row[col]) : undefined}
                                style={{
                                  padding: "7px 10px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {row[col] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ),
            },
            {
              label: "Navigateur taxonomique",
              icon: ListTree,
              content: (
                <div style={{ marginBottom: 32 }}>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>
                    Ordre → genre (dérivé du nom scientifique) → espèce. Cliquer une espèce ouvre sa fiche.
                  </p>
                  <TaxonTree rows={filtered} onSelect={selectFromTree} />
                </div>
              ),
            },
          ]}
        />
      </div>

      <SectionTitle>Fiche détaillée</SectionTitle>
      {!detail ? (
        <p style={{ color: "var(--text-muted)" }}>Aucun taxon disponible.</p>
      ) : (
        <TaxonSheet taxon={detail} />
      )}
    </div>
  );
}

function ExportButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface-1)",
        color: "var(--text-secondary)",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Field({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <p style={{ margin: "4px 0", fontSize: 14 }}>
      <strong style={{ color: "var(--text-primary)" }}>{label}</strong>{" "}
      <span style={{ color: "var(--text-secondary)" }}>: {String(value)}</span>
    </p>
  );
}

function FieldGroupTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <h4
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "var(--brand-copper)",
        fontSize: 13,
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      <Icon size={14} strokeWidth={1.75} aria-hidden />
      {children}
    </h4>
  );
}

function TaxonSheet({ taxon }: { taxon: Taxon }) {
  return (
    <div
      className="print-area"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--brand-cream)", marginBottom: 16 }}>
          {taxon.Nom_taxon}
        </h2>
        <button
          className="print-hide"
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--text-secondary)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Printer size={14} strokeWidth={1.75} aria-hidden />
          Exporter en PDF
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <FieldGroupTitle icon={Microscope}>Classification</FieldGroupTitle>
          {CLASSIFICATION_FIELDS.map((f) => (
            <Field key={f} label={f} value={taxon[f]} />
          ))}

          <div style={{ marginTop: 20 }}>
            <FieldGroupTitle icon={MapPin}>Localisation &amp; auteurs</FieldGroupTitle>
          </div>
          {LOCATION_FIELDS.map((f) => (
            <Field key={f} label={f} value={taxon[f]} />
          ))}
        </div>

        <div>
          <FieldGroupTitle icon={Clock}>Chronostratigraphie</FieldGroupTitle>
          {STRATI_FIELDS.map((f) => (
            <Field key={f} label={f} value={taxon[f]} />
          ))}

          {taxon.latitude !== null && taxon.longitude !== null && (
            <>
              <div style={{ marginTop: 20 }}>
                <FieldGroupTitle icon={Compass}>Coordonnées</FieldGroupTitle>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Lat <strong style={{ color: "var(--text-primary)" }}>{taxon.latitude}</strong> / Lon{" "}
                <strong style={{ color: "var(--text-primary)" }}>{taxon.longitude}</strong>
              </p>
            </>
          )}
        </div>
      </div>

      {taxon.Description && (
        <div style={{ marginTop: 20 }}>
          <FieldGroupTitle icon={FileText}>Description morphologique</FieldGroupTitle>
          <p
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 12,
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
          >
            {taxon.Description}
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        {taxon["Paléoenvironnement"] && (
          <div>
            <FieldGroupTitle icon={Waves}>Paléoenvironnement</FieldGroupTitle>
            <p style={{ fontSize: 14, color: "var(--status-good)" }}>{taxon["Paléoenvironnement"]}</p>
          </div>
        )}
        {taxon["Paléogéographie"] && (
          <div>
            <FieldGroupTitle icon={Globe}>Paléogéographie</FieldGroupTitle>
            <p style={{ fontSize: 14, color: "var(--status-good)" }}>{taxon["Paléogéographie"]}</p>
          </div>
        )}
      </div>

      {taxon["Notes+"] && (
        <div style={{ marginTop: 20 }}>
          <FieldGroupTitle icon={StickyNote}>Notes complémentaires</FieldGroupTitle>
          <p style={{ fontSize: 14, color: "var(--status-warning)" }}>{taxon["Notes+"]}</p>
        </div>
      )}
    </div>
  );
}
