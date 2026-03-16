# 🦴 Tableau de bord Paléontologie — Bassin Sénégalo-Mauritanien

Visualisation interactive des foraminifères découverts sur les sites côtiers sénégalais (Popenguine 1998, Toubab Dialaw 2000, Lac Retba 2009).

---

## 📁 Structure du projet

```
paleonto_dashboard/
│
├── app.py                  ← Point d'entrée Streamlit (navigation + layout global)
│
├── data/                   ← Fichiers sources Excel
│   ├── 1998_Popenguine.xlsx
│   ├── 2000_ToubabDialaw.xlsx
│   └── 2009_LacRetba.xlsx
│
├── pages/                  ← Une page par onglet de navigation
│   ├── __init__.py
│   ├── home.py             ← Page d'accueil : KPIs + vue globale
│   ├── map_page.py         ← Carte interactive des découvertes
│   ├── analyses.py         ← Graphiques statistiques (taxonomie, enviro, strati)
│   └── catalogue.py        ← Catalogue / fiche détaillée par taxon
│
├── utils/                  ← Modules réutilisables
│   ├── __init__.py
│   ├── data_loader.py      ← Chargement, nettoyage et fusion des Excel
│   ├── charts.py           ← Fonctions de visualisation Plotly
│   └── filters.py          ← Widgets de filtre sidebar
│
├── assets/                 ← Images, logos (à compléter)
│
├── requirements.txt
└── README.md
```

---

## 🚀 Lancement

```bash
# 1. Installer les dépendances
pip install -r requirements.txt

# 2. Lancer l'application
streamlit run app.py
```

L'application s'ouvre sur http://localhost:8501

---

## 📄 Pages

| Page | Description |
|------|-------------|
| 🏠 Accueil | KPIs, répartition par type, distribution par âge géologique |
| 🗺️ Carte | Carte Mapbox interactive des sites, détail par site |
| 📊 Analyses | Taxonomie (sunburst, treemap), paléoenvironnement, stratigraphie |
| 📋 Catalogue | Recherche textuelle + fiche morphologique détaillée |

---

## 🔧 Données

| Fichier | Site | Période | Taxons |
|---------|------|---------|--------|
| `1998_Popenguine.xlsx` | Falaise de Popenguine | Danien (Paléocène) | 31 |
| `2000_ToubabDialaw.xlsx` | Toubab Dialaw | Éocène | 16 |
| `2009_LacRetba.xlsx` | Lac Retba (presqu'île Cap-Vert) | Holocène | 32 |
