"""
Composants de filtre réutilisables pour la sidebar Streamlit.
"""
import streamlit as st
import pandas as pd


def sidebar_filters(df: pd.DataFrame) -> pd.DataFrame:
    st.sidebar.header("🔍 Filtres")

    sources = sorted(df["Source"].unique())
    sel_sources = st.sidebar.multiselect(
        "Publication / Site", sources, default=sources
    )

    types = sorted(df["Type"].dropna().unique())
    sel_types = st.sidebar.multiselect("Type de foraminifère", types, default=types)

    classes = sorted(df["Classe"].dropna().unique())
    sel_classes = st.sidebar.multiselect("Classe", classes, default=classes)

    ages = sorted(df["Age_géologique"].dropna().unique())
    sel_ages = st.sidebar.multiselect("Âge géologique", ages, default=ages)

    mask = (
        df["Source"].isin(sel_sources)
        & df["Type"].isin(sel_types)
        & df["Classe"].isin(sel_classes)
        & df["Age_géologique"].isin(sel_ages)
    )
    return df[mask]
