"""
Page carte interactive des découvertes paléontologiques.
"""
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from utils.charts import map_decouvertes, PALETTE


def render(df: pd.DataFrame):
    st.title("🗺️ Carte des Découvertes Paléontologiques")
    st.markdown(
        "Localisation des sites de découverte des foraminifères "
        "le long de la côte sénégalaise."
    )

    # ── Options carte ────────────────────────────────────────────────────────
    with st.expander("⚙️ Options de la carte", expanded=False):
        col1, col2 = st.columns(2)
        with col1:
            color_by = st.selectbox(
                "Colorier par",
                ["Source", "Type", "Classe", "Age_géologique"],
                index=0,
            )
        with col2:
            map_style = st.selectbox(
                "Style de fond",
                ["carto-positron", "open-street-map", "carto-darkmatter"],
                index=0,
            )

    # ── Données géolocalisées ────────────────────────────────────────────────
    geo = df.dropna(subset=["latitude", "longitude"]).copy()
    geo["latitude"] = pd.to_numeric(geo["latitude"], errors="coerce")
    geo["longitude"] = pd.to_numeric(geo["longitude"], errors="coerce")
    geo = geo.dropna(subset=["latitude", "longitude"])

    n_total = len(df)
    n_geo = len(geo)

    if n_geo == 0:
        st.warning("Aucune donnée géolocalisée disponible pour les filtres sélectionnés.")
        return

    st.info(
        f"**{n_geo}** taxons géolocalisés sur **{n_total}** — "
        "certains taxons partagent le même site (point unique par site)."
    )

    # ── Carte principale ─────────────────────────────────────────────────────
    color_seq = list(PALETTE.values()) if color_by == "Source" else px.colors.qualitative.Set2

    fig = px.scatter_mapbox(
        geo,
        lat="latitude",
        lon="longitude",
        color=color_by,
        color_discrete_sequence=color_seq,
        color_discrete_map=PALETTE if color_by == "Source" else None,
        hover_name="Nom_taxon",
        hover_data={
            "Type": True,
            "Age_géologique": True,
            "Lieu_découverte": True,
            "Paléoenvironnement": True,
            "Auteur_site": True,
            "latitude": False,
            "longitude": False,
        },
        zoom=7.5,
        center={"lat": 14.65, "lon": -17.2},
        mapbox_style=map_style,
        height=580,
    )
    fig.update_traces(marker=dict(size=16, opacity=0.88))
    fig.update_layout(
        margin=dict(t=0, b=0, l=0, r=0),
        legend=dict(
            title=color_by,
            bgcolor="rgba(255,255,255,0.88)",
            bordercolor="#ccc",
            borderwidth=1,
        ),
    )
    st.plotly_chart(fig, width="stretch")

    # ── Tableau des sites ────────────────────────────────────────────────────
    st.markdown("---")
    st.markdown('<p class="section-title">Sites de découverte</p>', unsafe_allow_html=True)

    sites = (
        geo.groupby(["Lieu_découverte", "Source"])
        .agg(
            Taxons=("Nom_taxon", "count"),
            Latitude=("latitude", "first"),
            Longitude=("longitude", "first"),
            Types=("Type", lambda x: ", ".join(sorted(x.dropna().unique()))),
            Ages=("Age_géologique", lambda x: " | ".join(sorted(x.dropna().unique()))),
        )
        .reset_index()
        .sort_values("Taxons", ascending=False)
    )
    st.dataframe(sites, width="stretch", hide_index=True)

    # ── Détail au clic ───────────────────────────────────────────────────────
    st.markdown("---")
    st.markdown('<p class="section-title">Explorer un site</p>', unsafe_allow_html=True)
    lieux = sorted(geo["Lieu_découverte"].dropna().unique())
    sel = st.selectbox("Sélectionner un site", lieux)

    if sel:
        subset = geo[geo["Lieu_découverte"] == sel]
        st.markdown(f"**{len(subset)} taxons** découverts à *{sel}*")
        display_cols = [
            "Nom_taxon", "Type", "Classe", "Age_géologique",
            "Découvreur (auteur taxonomique)", "Auteur_site",
            "Paléoenvironnement", "Biozones",
        ]
        available = [c for c in display_cols if c in subset.columns]
        st.dataframe(subset[available], width="stretch", hide_index=True)
