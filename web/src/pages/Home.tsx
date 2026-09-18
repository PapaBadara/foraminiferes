import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { useData } from "../context/DataContext";
import { KpiCard, SectionTitle } from "../components/KpiCard";
import { SERIES_HEX } from "../lib/colors";
import { nivoTheme, chartTooltip } from "../lib/nivoTheme";

export function Home() {
  const { filtered } = useData();

  const nSources = new Set(filtered.map((t) => t.Source)).size;
  const nTypes = new Set(filtered.map((t) => t.Type).filter(Boolean)).size;
  const nAges = new Set(filtered.map((t) => t["Age_géologique"]).filter(Boolean)).size;

  const typeCounts = new Map<string, number>();
  filtered.forEach((t) => {
    if (!t.Type) return;
    typeCounts.set(t.Type, (typeCounts.get(t.Type) ?? 0) + 1);
  });
  const pieData = Array.from(typeCounts.entries()).map(([id, value]) => ({ id, label: id, value }));

  const sources = Array.from(new Set(filtered.map((t) => t.Source))).sort();
  const ages = Array.from(new Set(filtered.map((t) => t["Age_géologique"]).filter((a): a is string => !!a)));
  const barData = ages.map((age) => {
    const row: Record<string, string | number> = { age };
    sources.forEach((src) => {
      row[src] = filtered.filter((t) => t["Age_géologique"] === age && t.Source === src).length;
    });
    return row;
  });

  const summary = sources.map((src) => {
    const rows = filtered.filter((t) => t.Source === src);
    return {
      Source: src,
      Taxons: rows.length,
      Types: new Set(rows.map((r) => r.Type).filter(Boolean)).size,
      Classes: new Set(rows.map((r) => r.Classe).filter(Boolean)).size,
      Ages: new Set(rows.map((r) => r["Age_géologique"]).filter(Boolean)).size,
    };
  });

  return (
    <div>
      <h1 style={{ fontSize: 32, color: "var(--brand-cream)", marginBottom: 8 }}>
        Ichnosen — Bassin sénégalo-mauritanien
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: 680, marginBottom: 28 }}>
        Base de données de foraminifères découverts le long des côtes sénégalaises
        (Popenguine 1998 · Toubab Dialaw 2000 · Lac Retba 2009).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <KpiCard value={filtered.length} label="Taxons filtrés" />
        <KpiCard value={nSources} label="Sites / publications" />
        <KpiCard value={nTypes} label="Types de foraminifères" />
        <KpiCard value={nAges} label="Âges géologiques" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 32 }}>
        <div>
          <SectionTitle>Répartition par type</SectionTitle>
          <div style={{ height: 300, background: "var(--surface-1)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <ResponsivePie
              data={pieData}
              theme={nivoTheme}
              margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
              innerRadius={0.5}
              padAngle={1}
              cornerRadius={3}
              colors={SERIES_HEX}
              borderWidth={0}
              arcLabel={(d) => `${d.value}`}
              arcLinkLabelsTextColor="var(--text-secondary)"
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsTextColor="#17140f"
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  translateY: 36,
                  itemWidth: 90,
                  itemHeight: 18,
                  itemTextColor: "var(--text-secondary)",
                  symbolSize: 10,
                  symbolShape: "circle",
                },
              ]}
            />
          </div>
        </div>
        <div>
          <SectionTitle>Distribution par âge géologique &amp; source</SectionTitle>
          <div style={{ height: 300, background: "var(--surface-1)", borderRadius: 12, border: "1px solid var(--border)", padding: "8px 8px 0" }}>
            <ResponsiveBar
              data={barData}
              theme={nivoTheme}
              keys={sources}
              indexBy="age"
              margin={{ top: 10, right: 200, bottom: 60, left: 40 }}
              padding={0.3}
              colors={SERIES_HEX}
              axisBottom={{ tickRotation: -35 }}
              enableLabel={false}
              tooltip={chartTooltip}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "right",
                  direction: "column",
                  translateX: 190,
                  itemWidth: 180,
                  itemHeight: 22,
                  itemTextColor: "var(--text-secondary)",
                  symbolSize: 10,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <SectionTitle>Résumé par source</SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <th style={{ textAlign: "left", padding: "8px 12px" }}>Source</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Taxons</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Types uniques</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Classes</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Âges</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.Source} style={{ borderBottom: "1px solid var(--gridline)" }}>
              <td style={{ padding: "8px 12px" }}>{row.Source}</td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>{row.Taxons}</td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>{row.Types}</td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>{row.Classes}</td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>{row.Ages}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
