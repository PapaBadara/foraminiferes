import { ResponsiveSunburst } from "@nivo/sunburst";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { BarChart3, Box, Waves, Layers } from "lucide-react";
import { useData } from "../context/DataContext";
import { SectionTitle } from "../components/KpiCard";
import { PageTitle } from "../components/PageTitle";
import { ChartCard } from "../components/ChartCard";
import { Tabs } from "../components/Tabs";
import { buildTree } from "../lib/hierarchy";
import { SERIES_HEX, SEQUENTIAL_HEX, capCategories } from "../lib/colors";
import { nivoTheme, chartTooltip } from "../lib/nivoTheme";

export function Analyses() {
  const { filtered } = useData();

  return (
    <div>
      <PageTitle icon={BarChart3}>Analyses statistiques</PageTitle>
      <Tabs
        tabs={[
          { label: "Taxonomie", icon: Box, content: <TaxonomieTab rows={filtered} /> },
          { label: "Paléoenvironnement", icon: Waves, content: <EnvTab rows={filtered} /> },
          { label: "Stratigraphie", icon: Layers, content: <StratiTab rows={filtered} /> },
        ]}
      />
    </div>
  );
}

function TaxonomieTab({ rows }: { rows: ReturnType<typeof useData>["filtered"] }) {
  const sunburstData = { id: "root", children: buildTree(rows, ["Source", "Classe", "Type"]) };

  const ordreCounts = new Map<string, number>();
  rows.forEach((r) => {
    const o = r["Groupe/Ordre"];
    if (o) ordreCounts.set(o, (ordreCounts.get(o) ?? 0) + 1);
  });
  const ordreData = Array.from(ordreCounts.entries())
    .map(([ordre, n]) => ({ ordre, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 10)
    .reverse();

  const embTree = { id: "root", children: buildTree(rows, ["Règne", "Embranchement"]) };

  const classes = Array.from(new Set(rows.map((r) => r.Classe).filter((c): c is string => !!c)));
  const sources = Array.from(new Set(rows.map((r) => r.Source))).sort();
  const pivot = classes.map((cl) => {
    const row: Record<string, string | number> = { Classe: cl };
    sources.forEach((s) => {
      row[s] = rows.filter((r) => r.Classe === cl && r.Source === s).length;
    });
    return row;
  });

  return (
    <div>
      <SectionTitle>Hiérarchie taxonomique</SectionTitle>
      <ChartCard height={420}>
        <ResponsiveSunburst
          data={sunburstData}
          theme={nivoTheme}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          id="id"
          value="value"
          cornerRadius={2}
          borderWidth={2}
          borderColor="var(--surface-1)"
          colors={SERIES_HEX}
          childColor={{ from: "color", modifiers: [["brighter", 0.4]] }}
          animate={false}
        />
      </ChartCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
        <div>
          <SectionTitle>Top 10 Ordres / Groupes</SectionTitle>
          <ChartCard height={320}>
            <ResponsiveBar
              data={ordreData}
              theme={nivoTheme}
              keys={["n"]}
              indexBy="ordre"
              layout="horizontal"
              margin={{ top: 10, right: 20, bottom: 30, left: 140 }}
              padding={0.25}
              colors={[SEQUENTIAL_HEX[3]]}
              enableLabel
              labelTextColor="#17140f"
              tooltip={chartTooltip}
            />
          </ChartCard>
        </div>
        <div>
          <SectionTitle>Règne &amp; Embranchement</SectionTitle>
          <ChartCard height={320}>
            <ResponsiveTreeMap
              data={embTree}
              theme={nivoTheme}
              identity="id"
              value="value"
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              labelSkipSize={20}
              labelTextColor="#17140f"
              colors={SERIES_HEX}
              borderColor="var(--surface-1)"
              animate={false}
            />
          </ChartCard>
        </div>
      </div>

      <SectionTitle>
        <span style={{ display: "block", marginTop: 32 }}>Nombre de taxons : Classe × Source</span>
      </SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <th style={{ textAlign: "left", padding: "8px 12px" }}>Classe</th>
            {sources.map((s) => (
              <th key={s} style={{ textAlign: "right", padding: "8px 12px" }}>
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pivot.map((row) => (
            <tr key={row.Classe as string} style={{ borderBottom: "1px solid var(--gridline)" }}>
              <td style={{ padding: "8px 12px" }}>{row.Classe}</td>
              {sources.map((s) => (
                <td key={s} style={{ textAlign: "right", padding: "8px 12px" }}>
                  {row[s]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnvTab({ rows }: { rows: ReturnType<typeof useData>["filtered"] }) {
  const envCounts = new Map<string, number>();
  rows.forEach((r) => {
    const e = r["Paléoenvironnement"];
    if (e) envCounts.set(e, (envCounts.get(e) ?? 0) + 1);
  });
  const envData = Array.from(envCounts.entries())
    .map(([env, n]) => ({ env, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 12)
    .reverse();

  const sources = Array.from(new Set(rows.map((r) => r.Source))).sort();
  const capped = capCategories(
    Array.from(envCounts.entries()).map(([label, value]) => ({ label, value }))
  );
  const keptEnvs = new Set(capped.filter((c) => c.label !== "Autres").map((c) => c.label));

  const envSrcData = sources.map((src) => {
    const row: Record<string, string | number> = { source: src };
    const rowsForSrc = rows.filter((r) => r.Source === src);
    let autres = 0;
    rowsForSrc.forEach((r) => {
      const e = r["Paléoenvironnement"];
      if (!e) return;
      if (keptEnvs.has(e)) {
        row[e] = ((row[e] as number) ?? 0) + 1;
      } else {
        autres += 1;
      }
    });
    if (autres > 0) row["Autres"] = autres;
    return row;
  });
  const envKeys = [...Array.from(keptEnvs), ...(envSrcData.some((r) => "Autres" in r) ? ["Autres"] : [])];

  return (
    <div>
      <SectionTitle>Types de paléoenvironnements</SectionTitle>
      <ChartCard height={380}>
        <ResponsiveBar
          data={envData}
          theme={nivoTheme}
          keys={["n"]}
          indexBy="env"
          layout="horizontal"
          margin={{ top: 10, right: 20, bottom: 30, left: 220 }}
          padding={0.25}
          colors={[SEQUENTIAL_HEX[3]]}
          tooltip={chartTooltip}
        />
      </ChartCard>

      <SectionTitle>
        <span style={{ display: "block", marginTop: 32 }}>Environnement par source</span>
      </SectionTitle>
      <ChartCard height={380}>
        <ResponsiveBar
          data={envSrcData}
          theme={nivoTheme}
          keys={envKeys}
          indexBy="source"
          margin={{ top: 10, right: 260, bottom: 40, left: 40 }}
          padding={0.3}
          colors={SERIES_HEX}
          tooltip={chartTooltip}
          legends={[
            {
              dataFrom: "keys",
              anchor: "right",
              direction: "column",
              translateX: 200,
              itemWidth: 240,
              itemHeight: 22,
              itemTextColor: "var(--text-secondary)",
              symbolSize: 10,
            },
          ]}
        />
      </ChartCard>
    </div>
  );
}

function StratiTab({ rows }: { rows: ReturnType<typeof useData>["filtered"] }) {
  const sources = Array.from(new Set(rows.map((r) => r.Source))).sort();
  const biozones = Array.from(new Set(rows.map((r) => r.Biozones).filter((b): b is string => !!b)));
  const biozoneData = biozones.map((bz) => {
    const row: Record<string, string | number> = { biozone: bz };
    sources.forEach((s) => {
      row[s] = rows.filter((r) => r.Biozones === bz && r.Source === s).length;
    });
    return row;
  });

  const prof = rows.filter(
    (r) => r["Année"] === 2009 && r.From_m !== null && r.To_m !== null
  );
  const types = Array.from(new Set(prof.map((r) => r.Type).filter((t): t is string => !!t)));
  const scatterData = types.map((type) => ({
    id: type,
    data: prof
      .filter((r) => r.Type === type)
      .map((r) => ({ x: r.From_m as number, y: r.Nom_taxon ?? "" })),
  }));

  return (
    <div>
      <SectionTitle>Distribution des biozones par source</SectionTitle>
      <ChartCard height={380}>
        <ResponsiveBar
          data={biozoneData}
          theme={nivoTheme}
          keys={sources}
          indexBy="biozone"
          groupMode="grouped"
          margin={{ top: 10, right: 200, bottom: 60, left: 40 }}
          padding={0.3}
          colors={SERIES_HEX}
          axisBottom={{ tickRotation: -40 }}
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
      </ChartCard>

      <SectionTitle>
        <span style={{ display: "block", marginTop: 32 }}>
          Profondeur stratigraphique (site 2009 – Lac Retba)
        </span>
      </SectionTitle>
      {prof.length > 0 ? (
        <ChartCard height={Math.max(300, prof.length * 26)}>
          <ResponsiveScatterPlot
            data={scatterData}
            theme={nivoTheme}
            margin={{ top: 20, right: 120, bottom: 50, left: 200 }}
            xScale={{ type: "linear" }}
            yScale={{ type: "point" }}
            colors={SERIES_HEX}
            axisBottom={{ legend: "Profondeur (m)", legendPosition: "middle", legendOffset: 40 }}
            nodeSize={10}
            legends={[
              {
                anchor: "right",
                direction: "column",
                translateX: 110,
                itemWidth: 100,
                itemHeight: 20,
                itemTextColor: "var(--text-secondary)",
                symbolSize: 10,
              },
            ]}
          />
        </ChartCard>
      ) : (
        <p style={{ color: "var(--text-muted)" }}>Aucune donnée de profondeur disponible pour les filtres sélectionnés.</p>
      )}
    </div>
  );
}
