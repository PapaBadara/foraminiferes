import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Map as MapIcon } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useData } from "../context/DataContext";
import { SectionTitle } from "../components/KpiCard";
import { PageTitle } from "../components/PageTitle";
import { colorScaleFor } from "../lib/colors";

const CENTER: [number, number] = [14.65, -17.2];

export function MapPage() {
  const { filtered } = useData();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const geo = useMemo(
    () => filtered.filter((t) => t.latitude !== null && t.longitude !== null),
    [filtered]
  );

  const sources = useMemo(() => Array.from(new Set(geo.map((t) => t.Source))).sort(), [geo]);
  const colorFor = useMemo(() => colorScaleFor(sources), [sources]);

  const sites = useMemo(() => {
    const groups = new Map<string, typeof geo>();
    geo.forEach((row) => {
      const key = `${row["Lieu_découverte"]}__${row.Source}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    });
    return Array.from(groups.entries())
      .map(([key, rows]) => {
        const [lieu, source] = key.split("__");
        const types = Array.from(new Set(rows.map((r) => r.Type).filter(Boolean))).sort().join(", ");
        const ages = Array.from(new Set(rows.map((r) => r["Age_géologique"]).filter(Boolean))).sort().join(" | ");
        return {
          lieu,
          source,
          taxons: rows.length,
          lat: rows[0].latitude!,
          lon: rows[0].longitude!,
          types,
          ages,
        };
      })
      .sort((a, b) => b.taxons - a.taxons);
  }, [geo]);

  const lieux = useMemo(
    () => Array.from(new Set(geo.map((t) => t["Lieu_découverte"]).filter((l): l is string => !!l))).sort(),
    [geo]
  );

  const siteDetail = geo.filter((t) => t["Lieu_découverte"] === (selectedSite ?? lieux[0]));

  if (geo.length === 0) {
    return (
      <div>
        <PageTitle icon={MapIcon}>Carte des découvertes</PageTitle>
        <p style={{ color: "var(--status-warning)" }}>
          Aucune donnée géolocalisée disponible pour les filtres sélectionnés.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageTitle icon={MapIcon}>Carte des découvertes paléontologiques</PageTitle>
      <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
        Localisation des sites de découverte des foraminifères le long de la côte sénégalaise.
      </p>

      <p
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "10px 16px",
          color: "var(--text-secondary)",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        <strong style={{ color: "var(--brand-cream)" }}>{geo.length}</strong> taxons géolocalisés sur{" "}
        <strong style={{ color: "var(--brand-cream)" }}>{filtered.length}</strong> — un point par site
        (les coordonnées ne sont saisies qu'une fois par lieu de découverte dans les données sources).
      </p>

      <div style={{ height: 540, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 32 }}>
        <MapContainer center={CENTER} zoom={8} style={{ height: "100%", width: "100%", background: "var(--surface-1)" }}>
          <TileLayer
            className="map-tiles-dark"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading>
            {geo.map((row) => (
              <CircleMarker
                key={row.id}
                center={[row.latitude!, row.longitude!]}
                radius={9}
                pathOptions={{
                  color: colorFor[row.Source],
                  fillColor: colorFor[row.Source],
                  fillOpacity: 0.85,
                  weight: 1,
                }}
              >
                <Popup>
                  <strong>{row.Nom_taxon}</strong>
                  <br />
                  {row.Type} · {row["Age_géologique"]}
                  <br />
                  {row["Lieu_découverte"]}
                  <br />
                  <em>{row.Source}</em>
                  <br />
                  <Link to={`/catalogue?taxon=${row.id}`} style={{ fontSize: 12 }}>
                    Voir la fiche →
                  </Link>
                </Popup>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      <SectionTitle>Sites de découverte</SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 32 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Lieu</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Source</th>
            <th style={{ textAlign: "right", padding: "8px 10px" }}>Taxons</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Types</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Âges</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s) => (
            <tr key={`${s.lieu}-${s.source}`} style={{ borderBottom: "1px solid var(--gridline)" }}>
              <td style={{ padding: "7px 10px" }}>{s.lieu}</td>
              <td style={{ padding: "7px 10px" }}>{s.source}</td>
              <td style={{ textAlign: "right", padding: "7px 10px" }}>{s.taxons}</td>
              <td style={{ padding: "7px 10px" }}>{s.types}</td>
              <td style={{ padding: "7px 10px" }}>{s.ages}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionTitle>Explorer un site</SectionTitle>
      <select
        value={selectedSite ?? lieux[0]}
        onChange={(e) => setSelectedSite(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface-1)",
          color: "var(--text-primary)",
          marginBottom: 16,
        }}
      >
        {lieux.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>
        <strong style={{ color: "var(--brand-cream)" }}>{siteDetail.length} taxons</strong> découverts à{" "}
        <em>{selectedSite ?? lieux[0]}</em>
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Nom_taxon</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Type</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Classe</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Âge géologique</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Découvreur</th>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Paléoenvironnement</th>
            <th style={{ padding: "8px 10px" }}></th>
          </tr>
        </thead>
        <tbody>
          {siteDetail.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid var(--gridline)" }}>
              <td style={{ padding: "7px 10px" }}>{row.Nom_taxon}</td>
              <td style={{ padding: "7px 10px" }}>{row.Type}</td>
              <td style={{ padding: "7px 10px" }}>{row.Classe}</td>
              <td style={{ padding: "7px 10px" }}>{row["Age_géologique"]}</td>
              <td style={{ padding: "7px 10px" }}>{row["Découvreur (auteur taxonomique)"]}</td>
              <td style={{ padding: "7px 10px" }}>{row["Paléoenvironnement"]}</td>
              <td style={{ padding: "7px 10px", whiteSpace: "nowrap" }}>
                <Link to={`/catalogue?taxon=${row.id}`}>Fiche →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
