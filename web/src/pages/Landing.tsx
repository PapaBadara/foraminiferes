import { Link } from "react-router-dom";
import {
  Map,
  BarChart3,
  ClipboardList,
  BookMarked,
  ListTree,
  Download,
  ArrowRight,
  Layers,
  MapPin,
  FlaskConical,
} from "lucide-react";
import { groupByTaxon, useData } from "../context/DataContext";

const NAV_LINKS = [
  { to: "/carte", label: "Carte" },
  { to: "/analyses", label: "Analyses" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/bibliographie", label: "Bibliographie" },
];

const FEATURES = [
  {
    icon: Map,
    title: "Carte interactive",
    desc: "Localisez chaque occurrence sur les bassins sénégalo-mauritanien et de Casamance, avec regroupement par cluster.",
    to: "/carte",
  },
  {
    icon: ListTree,
    title: "Navigateur taxonomique",
    desc: "Parcourez la classification complète — groupe → ordre → genre → espèce — foraminifères et ostracodes confondus.",
    to: "/catalogue",
  },
  {
    icon: BarChart3,
    title: "Analyses statistiques",
    desc: "Hiérarchie taxonomique, paléoenvironnements et stratigraphie visualisés par bassin.",
    to: "/analyses",
  },
  {
    icon: ClipboardList,
    title: "Fiches illustrées",
    desc: "Description morphologique, contexte stratigraphique et photo de spécimen quand elle est disponible.",
    to: "/catalogue",
  },
  {
    icon: BookMarked,
    title: "Bibliographie",
    desc: "Chaque occurrence est rattachée à sa publication source, consultable dans son intégralité.",
    to: "/bibliographie",
  },
  {
    icon: Download,
    title: "Export ouvert",
    desc: "Jeux de données filtrés exportables en CSV ou JSON.",
    to: "/catalogue",
  },
];

export function Landing() {
  const { all, references } = useData();
  const taxa = groupByTaxon(all);
  const nLocalities = new Set(all.map((o) => o.locality_nom).filter(Boolean)).size;

  const stats = [
    { icon: FlaskConical, value: taxa.length, label: "Taxons" },
    { icon: Layers, value: all.length, label: "Occurrences" },
    { icon: MapPin, value: nLocalities, label: "Localités" },
    { icon: BookMarked, value: references.length, label: "Références" },
  ];

  const topRefs = [...references]
    .sort((a, b) => (b.annee ?? 0) - (a.annee ?? 0))
    .slice(0, 3);

  return (
    <div style={{ background: "var(--page-plane)", minHeight: "100vh" }}>
      {/* Nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
          background: "rgba(14, 12, 10, 0.85)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/brand/icon.svg" alt="" width={30} height={30} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--brand-cream)", fontWeight: 600 }}>
            Ichnosen
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {l.label}
            </Link>
          ))}
          <Link
            to="/accueil"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--brand-copper)",
              color: "#17140f",
              fontWeight: 600,
              fontSize: 14,
              padding: "9px 18px",
              borderRadius: 999,
            }}
          >
            Explorer la base <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "110px 40px 90px",
          textAlign: "center",
          background: "radial-gradient(ellipse at 50% -10%, #241c14 0%, var(--page-plane) 65%)",
        }}
      >
        <img
          src="/brand/icon.svg"
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 900,
            height: 900,
            transform: "translate(-50%, -50%)",
            opacity: 0.04,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              color: "var(--brand-cream)",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Chronicles of Earth — les microfossiles du Sénégal
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.6, marginBottom: 36 }}>
            Base de référence sur les foraminifères et ostracodes des bassins sénégalo-mauritanien et de
            Casamance, consolidée à partir des travaux de Sarr et al. (1998–2023).
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/catalogue"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--brand-copper)",
                color: "#17140f",
                fontWeight: 600,
                fontSize: 15,
                padding: "13px 26px",
                borderRadius: 999,
              }}
            >
              Explorer le catalogue <ArrowRight size={17} strokeWidth={2} />
            </Link>
            <Link
              to="/carte"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--brand-cream)",
                fontWeight: 600,
                fontSize: 15,
                padding: "13px 26px",
                borderRadius: 999,
              }}
            >
              Voir la carte
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 40px 90px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "26px 20px",
                textAlign: "center",
              }}
            >
              <s.icon size={22} strokeWidth={1.75} color="var(--brand-copper)" style={{ marginBottom: 10 }} />
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--brand-cream)" }}>
                {s.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 40px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--brand-cream)", marginBottom: 10 }}>
            Modules de la plateforme
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Tout ce qu'il faut pour explorer les données</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              style={{
                display: "block",
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <f.icon size={20} strokeWidth={1.75} color="var(--brand-copper)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--brand-cream)", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section style={{ padding: "0 40px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--brand-cream)", marginBottom: 10 }}>
            Basé sur des publications scientifiques
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            {references.length} références dépouillées, consultables dans la bibliographie
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {topRefs.map((ref) => (
            <div
              key={ref.id}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 22,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--brand-cream)", marginBottom: 8 }}>
                {ref.citation}
              </h3>
              {ref.titre && (
                <p style={{ color: "var(--text-secondary)", fontSize: 13, fontStyle: "italic", margin: 0 }}>{ref.titre}</p>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link to="/bibliographie" style={{ color: "var(--brand-copper)", fontSize: 14, fontWeight: 600 }}>
            Voir toute la bibliographie →
          </Link>
        </div>
      </section>

      {/* CTA band */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--surface-2), var(--surface-3))",
          padding: "70px 40px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--brand-cream)", marginBottom: 12 }}>
          Prêt à explorer la base ?
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 28 }}>
          {taxa.length} taxons vous attendent dans le catalogue.
        </p>
        <Link
          to="/catalogue"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--brand-copper)",
            color: "#17140f",
            fontWeight: 600,
            fontSize: 15,
            padding: "13px 28px",
            borderRadius: 999,
          }}
        >
          Explorer le catalogue <ArrowRight size={17} strokeWidth={2} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "48px 40px 28px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 40,
            marginBottom: 32,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <img src="/brand/icon.svg" alt="" width={26} height={26} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--brand-cream)" }}>
                Ichnosen
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 360, margin: 0 }}>
              Plateforme de référence sur les microfossiles du bassin sénégalo-mauritanien.
            </p>
          </div>
          <div>
            <h4 style={{ color: "var(--brand-cream)", fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>
              Explorer
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, margin: 0 }}>
          Ichnosen — données issues des travaux de Sarr et al. (1998–2023)
        </p>
      </footer>
    </div>
  );
}
