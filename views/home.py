"""
Page d'accueil : KPIs + aperçu rapide.
"""
import streamlit as st
import pandas as pd
from utils.charts import chart_type_distribution, chart_age_timeline


def _kpi(col, value, label):
    col.markdown(
        f'<div class="kpi-card"><h2>{value}</h2><p>{label}</p></div>',
        unsafe_allow_html=True,
    )


def render(df: pd.DataFrame):
    st.title("🦴 Paléontologie du Bassin Sénégalo-Mauritanien")
    st.markdown(
        "Base de données de foraminifères découverts le long des côtes sénégalaises "
        "(**Popenguine 1998 · Toubab Dialaw 2000 · Lac Retba 2009**)."
    )
    st.markdown("---")

    # ── KPIs ────────────────────────────────────────────────────────────────
    c1, c2, c3, c4 = st.columns(4)
    _kpi(c1, len(df), "Taxons filtrés")
    _kpi(c2, df["Source"].nunique(), "Sites / publications")
    _kpi(c3, df["Type"].nunique(), "Types de foraminifères")
    _kpi(c4, df["Age_géologique"].nunique(), "Âges géologiques")

    st.markdown("<br>", unsafe_allow_html=True)

    # ── Graphiques ──────────────────────────────────────────────────────────
    col_l, col_r = st.columns([1, 2])

    with col_l:
        st.markdown('<p class="section-title">Répartition par type</p>', unsafe_allow_html=True)
        st.plotly_chart(chart_type_distribution(df), width="stretch")

    with col_r:
        st.markdown('<p class="section-title">Distribution par âge géologique & source</p>', unsafe_allow_html=True)
        st.plotly_chart(chart_age_timeline(df), width="stretch")

    # ── Tableau résumé par source ────────────────────────────────────────────
    st.markdown("---")
    st.markdown('<p class="section-title">Résumé par source</p>', unsafe_allow_html=True)
    summary = (
        df.groupby("Source")
        .agg(
            Taxons=("Nom_taxon", "count"),
            Types_uniques=("Type", "nunique"),
            Classes=("Classe", "nunique"),
            Ages=("Age_géologique", "nunique"),
        )
        .reset_index()
    )
    st.dataframe(summary, width="stretch", hide_index=True)
