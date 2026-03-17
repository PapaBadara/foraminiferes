"""
Point d'entrée principal du tableau de bord paléontologique.
Lance : streamlit run app.py
"""
import streamlit as st

st.set_page_config(
    page_title="Paléontologie – Sénégal",
    page_icon="🦴",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── CSS custom ──────────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
    section[data-testid="stSidebar"] { background-color: #1a2332; }
    section[data-testid="stSidebar"] * { color: #e8eaf0 !important; }
    section[data-testid="stSidebar"] .stMultiSelect [data-baseweb="tag"] {
        background-color: #3d5a80;
    }
    .kpi-card {
        background: linear-gradient(135deg,#1e3a5f,#2d5986);
        border-radius: 12px; padding: 18px 22px;
        border-left: 4px solid #5B8DB8; color: white;
    }
    .kpi-card h2 { margin:0; font-size:2rem; color:#7ec8e3; }
    .kpi-card p  { margin:4px 0 0; font-size:.85rem; color:#b0c4de; }
    .section-title {
        font-size:1.1rem; font-weight:700; color:#2d5986;
        border-bottom:2px solid #5B8DB8; padding-bottom:4px;
        margin-bottom:12px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

from utils.data_loader import load_all
from utils.filters import sidebar_filters

@st.cache_data
def get_data():
    return load_all()

df_all = get_data()

# ── SIDEBAR : ordre = Titre → Navigation → Séparateur → Filtres → Compteur ──
st.sidebar.markdown("## 🦴 Paléontologie\n**Bassin sénégalo-mauritanien**")
st.sidebar.markdown("---")

page = st.sidebar.radio(
    "Navigation",
    ["🏠 Accueil", "🗺️ Carte des découvertes", "📊 Analyses", "📋 Catalogue"],
    index=0,
)

st.sidebar.markdown("---")

df = sidebar_filters(df_all)

st.sidebar.markdown("---")
st.sidebar.caption(f"**{len(df)}** taxons affichés sur **{len(df_all)}** total")

# ── Routage ──────────────────────────────────────────────────────────────────
if page == "🏠 Accueil":
    from views.home import render
elif page == "🗺️ Carte des découvertes":
    from views.map_page import render
elif page == "📊 Analyses":
    from views.analyses import render
elif page == "📋 Catalogue":
    from views.catalogue import render

render(df)
