"""
Page catalogue : fiche détaillée de chaque taxon.
"""
import streamlit as st
import pandas as pd


def render(df: pd.DataFrame):
    st.title("📋 Catalogue des Taxons")

    # ── Recherche texte ──────────────────────────────────────────────────────
    search = st.text_input("🔎 Rechercher un taxon (nom, auteur, description…)", "")
    if search.strip():
        mask = df.apply(
            lambda row: row.astype(str).str.contains(search, case=False, na=False).any(),
            axis=1,
        )
        df = df[mask]

    st.caption(f"**{len(df)}** taxons correspondants")

    # ── Tableau interactif ───────────────────────────────────────────────────
    display_cols = [
        "Nom_taxon", "Type", "Classe", "Groupe/Ordre",
        "Age_géologique", "Lieu_découverte",
        "Découvreur (auteur taxonomique)", "Auteur_site",
        "Biozones", "Source",
    ]
    available = [c for c in display_cols if c in df.columns]

    st.dataframe(
        df[available].reset_index(drop=True),
        width="stretch",
        hide_index=True,
        height=320,
    )

    # ── Fiche détaillée ──────────────────────────────────────────────────────
    st.markdown("---")
    st.markdown('<p class="section-title">Fiche détaillée</p>', unsafe_allow_html=True)

    noms = sorted(df["Nom_taxon"].dropna().unique())
    if not noms:
        st.warning("Aucun taxon disponible.")
        return

    sel = st.selectbox("Sélectionner un taxon", noms)
    row = df[df["Nom_taxon"] == sel].iloc[0]

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("#### 🔬 Classification")
        for field in ["Règne", "Embranchement", "Classe", "Groupe/Ordre", "Type"]:
            if field in row and pd.notna(row[field]):
                st.markdown(f"**{field}** : {row[field]}")

        st.markdown("#### 📍 Localisation & Auteurs")
        for field in [
            "Lieu_découverte",
            "Découvreur (auteur taxonomique)",
            "Auteur_site",
            "Source",
        ]:
            if field in row and pd.notna(row[field]):
                st.markdown(f"**{field}** : {row[field]}")

    with col2:
        st.markdown("#### 🕰️ Chronostratigraphie")
        for field in ["Age_géologique", "Biozones", "Stratigraphie", "From_m", "To_m"]:
            if field in row and pd.notna(row[field]):
                st.markdown(f"**{field}** : {row[field]}")

        if pd.notna(row.get("latitude")) and pd.notna(row.get("longitude")):
            st.markdown("#### 📌 Coordonnées")
            st.markdown(f"Lat **{row['latitude']}** / Lon **{row['longitude']}**")

    # Description
    if pd.notna(row.get("Description")):
        st.markdown("#### 📝 Description morphologique")
        st.info(row["Description"])

    # Paléoenvironnement
    col3, col4 = st.columns(2)
    with col3:
        if pd.notna(row.get("Paléoenvironnement")):
            st.markdown("#### 🌊 Paléoenvironnement")
            st.success(row["Paléoenvironnement"])
    with col4:
        if pd.notna(row.get("Paléogéographie")):
            st.markdown("#### 🌍 Paléogéographie")
            st.success(row["Paléogéographie"])

    # Notes
    if pd.notna(row.get("Notes+")):
        st.markdown("#### 📌 Notes complémentaires")
        st.warning(row["Notes+"])
