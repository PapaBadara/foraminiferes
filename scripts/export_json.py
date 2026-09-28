"""
Exporte la base IchnoSen (SQLite : taxa / occurrences / localities / references_)
vers deux JSON statiques consommes par le front React :
  - web/src/data/occurrences.json : une ligne par occurrence, taxon+localite+reference joints
  - web/src/data/references.json  : bibliographie (9 references)

Copie aussi les photos de specimens matchees vers web/public/photos/<taxon_id>.png.
"""
import json
import os
import re
import shutil
import sqlite3
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(
    ROOT, "data", "drive-download-20260916T004325Z-1-001", "IchnoSen.sqlite"
)
PHOTOS_DIR = os.path.join(
    ROOT, "data", "drive-download-20260916T004325Z-1-001", "Ichnosen_Photos"
)
OUT_DATA_DIR = os.path.join(ROOT, "web", "src", "data")
OUT_PHOTOS_DIR = os.path.join(ROOT, "web", "public", "photos")

# Coordonnees connues depuis les classeurs Excel d'origine (1998/2000), perdues
# lors de la consolidation dans LOC014 "Senegal occidental (a preciser)".
KNOWN_COORDS = {
    "Falaise de Popenguine": (14.5418, -17.1051),
    "Toubab Dialaw": (14.6020, -17.1470),
}

TYPE_TO_SOUS_TYPE = {
    "benthique": "Benthique",
    "foraminifère benthique": "Benthique",
    "planctonique": "Planctonique",
    "foraminifère planctonique": "Planctonique",
}


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode()
    s = s.lower()
    s = re.sub(r"\bcf\b|\bn\s*sp\b|\baff\b|\bgr\b", "", s)
    s = re.sub(r"[^a-z0-9]", "", s)
    return s


def none_if_blank(v):
    if v is None:
        return None
    if isinstance(v, str):
        v = v.strip()
        return v if v else None
    return v


def build_photo_index():
    index = {}
    for root, _dirs, files in os.walk(PHOTOS_DIR):
        for fn in files:
            if not fn.lower().endswith(".png"):
                continue
            key = norm(os.path.splitext(fn)[0])
            if key and key not in index:
                index[key] = os.path.join(root, fn)
    return index


def main():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    # --- taxa : on ecarte les lignes "legende" leakees dans le classeur source
    # (groupe vide -> ce sont des textes de legende, pas des taxons) ---
    cur.execute("SELECT * FROM taxa WHERE groupe != '' AND groupe IS NOT NULL")
    taxa_rows = {r["id"]: dict(r) for r in cur.fetchall()}
    dropped = 606 - len(taxa_rows)

    cur.execute("SELECT * FROM localities")
    localities = {r["id"]: dict(r) for r in cur.fetchall()}

    cur.execute("SELECT * FROM references_")
    references = {r["id"]: dict(r) for r in cur.fetchall()}

    photo_index = build_photo_index()
    os.makedirs(OUT_PHOTOS_DIR, exist_ok=True)
    matched_photos = 0

    for tid, t in taxa_rows.items():
        raw_type = (t.get("type") or "").strip()
        t["sous_type"] = TYPE_TO_SOUS_TYPE.get(raw_type.lower())
        t["groupe_label"] = "Ostracode" if t["groupe"] == "ostracode" else "Foraminifère"

        key = norm(t["nom_taxon"])
        photo_src = photo_index.get(key)
        if photo_src:
            dest_name = f"{tid}.png"
            shutil.copyfile(photo_src, os.path.join(OUT_PHOTOS_DIR, dest_name))
            t["photo"] = f"/photos/{dest_name}"
            matched_photos += 1
        else:
            t["photo"] = None

    cur.execute("SELECT * FROM occurrences")
    occ_rows = cur.fetchall()

    occurrences = []
    skipped_legend = 0
    coord_fixes = 0
    for row in occ_rows:
        occ = dict(row)
        taxon = taxa_rows.get(occ["taxon_id"])
        if taxon is None:
            skipped_legend += 1
            continue
        locality = localities.get(occ["locality_id"], {})
        reference = references.get(occ["reference_id"], {})

        lon, lat = locality.get("longitude"), locality.get("latitude")
        locality_nom = locality.get("nom")
        bassin = none_if_blank(locality.get("bassin"))
        site_detail = none_if_blank(occ.get("site_detail"))
        if lon is None and site_detail in KNOWN_COORDS:
            lat, lon = KNOWN_COORDS[site_detail]
            locality_nom = site_detail
            # Même bande côtière que les autres affleurements de ce bassin
            # (Ngazobil, Horst de Diass, etc.) — la fiche source les avait
            # laissés dans le bassin générique "à préciser".
            bassin = "Bassin sénégalo-mauritanien (ouest)"
            coord_fixes += 1

        occurrences.append(
            {
                "id": occ["id"],
                "taxon_id": taxon["id"],
                "nom_taxon": taxon["nom_taxon"],
                "groupe": taxon["groupe_label"],
                "sous_type": taxon["sous_type"],
                "regne": none_if_blank(taxon.get("regne")),
                "embranchement": none_if_blank(taxon.get("embranchement")),
                "classe": none_if_blank(taxon.get("classe")),
                "groupe_ordre": none_if_blank(taxon.get("groupe_ordre")),
                "decouvreur": none_if_blank(taxon.get("decouvreur")),
                "photo": taxon["photo"],
                "locality_id": occ["locality_id"],
                "locality_nom": locality_nom,
                "locality_type": none_if_blank(locality.get("type")),
                "bassin": bassin,
                "longitude": lon,
                "latitude": lat,
                "reference_id": occ["reference_id"],
                "reference_citation": none_if_blank(reference.get("citation")),
                "site_detail": site_detail,
                "age": none_if_blank(occ.get("age")),
                "biozones": none_if_blank(occ.get("biozones")),
                "stratigraphie": none_if_blank(occ.get("stratigraphie")),
                "formation": none_if_blank(occ.get("formation")),
                "paleoenv": none_if_blank(occ.get("paleoenv")),
                "paleogeo": none_if_blank(occ.get("paleogeo")),
                "description": none_if_blank(occ.get("description")),
                "n_collection": none_if_blank(occ.get("n_collection")),
                "notes": none_if_blank(occ.get("notes")),
                "source_file": none_if_blank(occ.get("source_file")),
            }
        )

    os.makedirs(OUT_DATA_DIR, exist_ok=True)
    with open(os.path.join(OUT_DATA_DIR, "occurrences.json"), "w", encoding="utf-8") as f:
        json.dump(occurrences, f, ensure_ascii=False, indent=2)

    references_out = [
        {
            "id": rid,
            "citation": none_if_blank(r.get("citation")),
            "annee": r.get("annee"),
            "revue": none_if_blank(r.get("revue")),
            "titre": none_if_blank(r.get("titre")),
        }
        for rid, r in references.items()
    ]
    with open(os.path.join(OUT_DATA_DIR, "references.json"), "w", encoding="utf-8") as f:
        json.dump(references_out, f, ensure_ascii=False, indent=2)

    print(f"{len(taxa_rows)} taxons retenus ({dropped} lignes légende écartées)")
    print(f"{len(occurrences)} occurrences exportées ({skipped_legend} rattachées à un taxon écarté)")
    print(f"{matched_photos} photos rattachées / {len(taxa_rows)} taxons")
    print(f"{coord_fixes} occurrences recoordonnées (Popenguine/Toubab Dialaw)")
    print(f"{len(references_out)} références exportées")


if __name__ == "__main__":
    main()
