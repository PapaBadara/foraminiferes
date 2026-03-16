"""
Chargement et nettoyage des données paléontologiques.
"""
import pandas as pd
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

SOURCES = {
    "1998 – Falaise de Popenguine": "1998_Popenguine.xlsx",
    "2000 – Toubab Dialaw": "2000_ToubabDialaw.xlsx",
    "2009 – Lac Retba": "2009_LacRetba.xlsx",
}


def _parse_coords(df: pd.DataFrame) -> pd.DataFrame:
    """Extrait les colonnes X/Y depuis la structure spéciale du fichier."""
    coord_col = [c for c in df.columns if "Coord" in str(c)]
    unnamed = [c for c in df.columns if "Unnamed" in str(c)]

    if coord_col and unnamed:
        x_col = coord_col[0]
        y_col = unnamed[-1]
        # La première ligne contient les labels "X" et "Y" ; on les saute
        df = df.copy()
        df["longitude"] = pd.to_numeric(df[x_col], errors="coerce")
        df["latitude"] = pd.to_numeric(df[y_col], errors="coerce")
        df.drop(columns=[x_col, y_col], inplace=True)
    else:
        df["longitude"] = None
        df["latitude"] = None
    return df


def _clean(df: pd.DataFrame, source_label: str, year: int) -> pd.DataFrame:
    df = df.copy()

    # Renommage harmonisé des colonnes
    rename_map = {
        "Classe ": "Classe",
        "Auteur(s) sur site ": "Auteur_site",
        "Coordonnées ": "Coordonnées",
        "From": "From_m",
        "To": "To_m",
        "From(m)": "From_m",
        "To(m)": "To_m",
    }
    df.rename(columns=rename_map, inplace=True)

    # Supprime lignes entièrement vides
    df.dropna(how="all", inplace=True)

    # Retire la ligne header interne si présente (ligne contenant "X" comme valeur)
    if "Nom_taxon" in df.columns:
        df = df[df["Nom_taxon"].astype(str).str.strip() != "X"]

    df["Source"] = source_label
    df["Année"] = year

    # Colonnes optionnelles
    for col in ["From_m", "To_m", "Notes+"]:
        if col not in df.columns:
            df[col] = None

    return df


def load_all() -> pd.DataFrame:
    """Charge et fusionne les trois fichiers Excel."""
    frames = []
    for label, filename in SOURCES.items():
        year = int(label[:4])
        path = os.path.join(DATA_DIR, filename)
        df = pd.read_excel(path, header=0)
        df = _parse_coords(df)
        df = _clean(df, label, year)
        frames.append(df)

    # Harmonise colonnes avant concat (évite FutureWarning)
    all_cols = list(dict.fromkeys(c for f in frames for c in f.columns))
    for i, f in enumerate(frames):
        for col in all_cols:
            if col not in f.columns:
                frames[i][col] = None
    combined = pd.concat([f[all_cols] for f in frames], ignore_index=True)
    combined = combined.loc[:, ~combined.columns.str.startswith("Unnamed")]

    return combined


def load_source(label: str) -> pd.DataFrame:
    """Charge un seul fichier source."""
    filename = SOURCES[label]
    year = int(label[:4])
    path = os.path.join(DATA_DIR, filename)
    df = pd.read_excel(path, header=0)
    df = _parse_coords(df)
    df = _clean(df, label, year)
    return df.loc[:, ~df.columns.str.startswith("Unnamed")]


def get_source_labels():
    return list(SOURCES.keys())
