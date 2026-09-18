# 🦴 Ichnosen — Tableau de bord Paléontologie (Bassin Sénégalo-Mauritanien)

Visualisation interactive des foraminifères découverts sur les sites côtiers sénégalais (Popenguine 1998, Toubab Dialaw 2000, Lac Retba 2009).

Deux implémentations coexistent dans ce dépôt :

- **`web/`** — application React (Vite + TypeScript), design Ichnosen, en développement actif. C'est la version cible.
- **Streamlit** (fichiers à la racine) — prototype initial, conservé pour référence.

---

## ⚛️ Application React (`web/`)

```bash
# 1. Régénérer les données JSON depuis les Excel (si data/*.xlsx a changé)
./.venv/Scripts/python.exe scripts/export_json.py

# 2. Installer les dépendances et lancer le serveur de dev
cd web
npm install
npm run dev
```

L'app s'ouvre sur http://localhost:5173. Les données sont statiques (`web/src/data/taxa.json`, générées par `scripts/export_json.py`) — pas de backend.

Identité visuelle : voir `ICHNOSEN/Identité Visuelle/Brandboard.pdf` (palette, logo). La police d'affichage "Bogart" n'étant pas fournie/libre, un serif chaleureux équivalent ("Fraunces") est utilisé en attendant.

---

## 🐍 Prototype Streamlit (racine)

> ⚠️ La page **Carte** de ce prototype est cassée avec les versions récentes de Plotly (`scatter_mapbox` retiré dans Plotly 7). Non corrigé puisque superseded par `web/`.

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
