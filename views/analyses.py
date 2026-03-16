"""
Page d'analyses statistiques et graphiques avancés.
"""
import streamlit as st
import pandas as pd
import plotly.express as px
from utils.charts import (
    chart_ordre_bar,
    chart_source_sunburst,
    PALETTE,
)


def render(df: pd.DataFrame):
    st.title("📊 Analyses Statistiques")

    tab1, tab2, tab3 = st.tabs(
        ["📦 Taxonomie", "🌊 Paléoenvironnement", "📅 Stratigraphie"]
    )

    # ── Onglet 1 : Taxonomie ─────────────────────────────────────────────────
    with tab1:
        st.markdown('<p class="section-title">Hiérarchie taxonomique</p>', unsafe_allow_html=True)
        st.plotly_chart(chart_source_sunburst(df), width="stretch")

        col_l, col_r = st.columns(2)
        with col_l:
            st.markdown('<p class="section-title">Top 10 Ordres / Groupes</p>', unsafe_allow_html=True)
            st.plotly_chart(chart_ordre_bar(df), width="stretch")

        with col_r:
            st.markdown('<p class="section-title">Règne & Embranchement</p>', unsafe_allow_html=True)
            emb = df.groupby(["Règne", "Embranchement"]).size().reset_index(name="n")
            fig_emb = px.treemap(
                emb, path=["Règne", "Embranchement"], values="n",
                color_discrete_sequence=list(PALETTE.values()),
            )
            fig_emb.update_layout(margin=dict(t=10, b=0), height=320)
            st.plotly_chart(fig_emb, width="stretch")

        # Table pivot classe × source
        st.markdown('<p class="section-title">Nombre de taxons : Classe × Source</p>', unsafe_allow_html=True)
        pivot = pd.crosstab(df["Classe"], df["Source"])
        st.dataframe(pivot, width="stretch")

    # ── Onglet 2 : Paléoenvironnement ────────────────────────────────────────
    with tab2:
        st.markdown('<p class="section-title">Types de paléoenvironnements</p>', unsafe_allow_html=True)

        env = df["Paléoenvironnement"].dropna().str.strip()
        env_counts = env.value_counts().head(12).reset_index()
        env_counts.columns = ["Paléoenvironnement", "n"]
        fig_env = px.bar(
            env_counts, x="n", y="Paléoenvironnement", orientation="h",
            color="n", color_continuous_scale="Teal",
        )
        fig_env.update_layout(
            yaxis=dict(autorange="reversed"),
            coloraxis_showscale=False,
            height=380, margin=dict(t=10),
        )
        st.plotly_chart(fig_env, width="stretch")

        st.markdown('<p class="section-title">Environnement par source</p>', unsafe_allow_html=True)
        env_src = df.groupby(["Source", "Paléoenvironnement"]).size().reset_index(name="n")
        fig_es = px.bar(
            env_src, x="Source", y="n", color="Paléoenvironnement",
            barmode="stack",
            color_discrete_sequence=px.colors.qualitative.Pastel,
        )
        fig_es.update_layout(
            legend=dict(orientation="h", yanchor="bottom", y=1.02),
            height=360,
        )
        st.plotly_chart(fig_es, width="stretch")

    # ── Onglet 3 : Stratigraphie ─────────────────────────────────────────────
    with tab3:
        st.markdown('<p class="section-title">Distribution des biozones par source</p>', unsafe_allow_html=True)

        bio = df.dropna(subset=["Biozones"])
        bio_counts = bio.groupby(["Biozones", "Source"]).size().reset_index(name="n")
        fig_bio = px.bar(
            bio_counts, x="Biozones", y="n", color="Source",
            color_discrete_map=PALETTE, barmode="group",
        )
        fig_bio.update_layout(
            xaxis_tickangle=-40,
            height=380,
            legend=dict(orientation="h", yanchor="bottom", y=1.02),
        )
        st.plotly_chart(fig_bio, width="stretch")

        # Profondeur (From / To) — uniquement 2009
        st.markdown('<p class="section-title">Profondeur stratigraphique (site 2009 – Lac Retba)</p>', unsafe_allow_html=True)
        prof = df[(df["Année"] == 2009) & df["From_m"].notna() & df["To_m"].notna()].copy()
        prof["From_m"] = pd.to_numeric(prof["From_m"], errors="coerce")
        prof["To_m"] = pd.to_numeric(prof["To_m"], errors="coerce")
        prof = prof.dropna(subset=["From_m", "To_m"])

        if not prof.empty:
            fig_prof = px.scatter(
                prof,
                x="From_m",
                y="Nom_taxon",
                error_x=prof["From_m"] - prof["To_m"],
                color="Type",
                labels={"From_m": "Profondeur (m)", "Nom_taxon": "Taxon"},
            )
            fig_prof.update_layout(height=max(300, len(prof) * 24), margin=dict(t=10))
            st.plotly_chart(fig_prof, width="stretch")
        else:
            st.info("Aucune donnée de profondeur disponible pour les filtres sélectionnés.")
