import { Link, NavLink } from "react-router-dom";
import { Landmark, Map, BarChart3, ClipboardList, BookMarked } from "lucide-react";

const NAV_ITEMS = [
  { to: "/accueil", label: "Accueil", icon: Landmark },
  { to: "/carte", label: "Carte", icon: Map },
  { to: "/analyses", label: "Analyses", icon: BarChart3 },
  { to: "/catalogue", label: "Catalogue", icon: ClipboardList },
  { to: "/bibliographie", label: "Bibliographie", icon: BookMarked },
];

export function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        background: "rgba(14, 12, 10, 0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/brand/icon.svg" alt="" width={28} height={28} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--brand-cream)", fontWeight: 600 }}>
          Ichnosen
        </span>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              color: isActive ? "var(--brand-cream)" : "var(--text-secondary)",
              background: isActive ? "var(--surface-3)" : "transparent",
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
            })}
          >
            <item.icon size={16} strokeWidth={1.75} color="var(--brand-copper)" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
