import { NavLink } from "react-router-dom";
import { Landmark, Map, BarChart3, ClipboardList, SlidersHorizontal, Download } from "lucide-react";
import { useData } from "../context/DataContext";
import { FilterGroup } from "./FilterGroup";
import { exportCsv, exportJson } from "../lib/export";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", icon: Landmark },
  { to: "/carte", label: "Carte des découvertes", icon: Map },
  { to: "/analyses", label: "Analyses", icon: BarChart3 },
  { to: "/catalogue", label: "Catalogue", icon: ClipboardList },
];

export function Sidebar() {
  const { filtered, all, filters, setFilters, options } = useData();

  return (
    <aside
      className="scrollbar-thin"
      style={{
        width: 300,
        flexShrink: 0,
        background: "var(--surface-1)",
        borderRight: "1px solid var(--border)",
        padding: "24px 20px",
        height: "100vh",
        overflowY: "auto",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <img src="/brand/icon.svg" alt="" width={32} height={32} />
        <div>
          <h1 style={{ fontSize: 20, color: "var(--brand-cream)" }}>Ichnosen</h1>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 24px" }}>
        Chronicles of Earth — Bassin sénégalo-mauritanien
      </p>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 28 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: "var(--radius-md)",
              color: isActive ? "var(--brand-cream)" : "var(--text-secondary)",
              background: isActive ? "var(--surface-3)" : "transparent",
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
            })}
          >
            <item.icon size={17} strokeWidth={1.75} color="var(--brand-copper)" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            color: "var(--brand-cream)",
            marginBottom: 16,
          }}
        >
          <SlidersHorizontal size={15} strokeWidth={1.75} color="var(--brand-copper)" aria-hidden />
          Filtres
        </div>
        <FilterGroup
          label="Publication / Site"
          options={options.sources}
          selected={filters.sources}
          onChange={(v) => setFilters({ ...filters, sources: v })}
        />
        <FilterGroup
          label="Type de foraminifère"
          options={options.types}
          selected={filters.types}
          onChange={(v) => setFilters({ ...filters, types: v })}
        />
        <FilterGroup
          label="Classe"
          options={options.classes}
          selected={filters.classes}
          onChange={(v) => setFilters({ ...filters, classes: v })}
        />
        <FilterGroup
          label="Âge géologique"
          options={options.ages}
          selected={filters.ages}
          onChange={(v) => setFilters({ ...filters, ages: v })}
        />
      </div>

      <p style={{ fontSize: 12, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 12 }}>
        <strong style={{ color: "var(--brand-cream)" }}>{filtered.length}</strong> taxons affichés sur{" "}
        <strong style={{ color: "var(--brand-cream)" }}>{all.length}</strong> total
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => exportCsv(filtered, "ichnosen-taxons-filtres.csv")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--text-secondary)",
            borderRadius: 8,
            padding: "6px 8px",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Download size={13} strokeWidth={1.75} aria-hidden />
          CSV
        </button>
        <button
          onClick={() => exportJson(filtered, "ichnosen-taxons-filtres.json")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--text-secondary)",
            borderRadius: 8,
            padding: "6px 8px",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Download size={13} strokeWidth={1.75} aria-hidden />
          JSON
        </button>
      </div>
    </aside>
  );
}
