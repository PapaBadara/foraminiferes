"""
Exporte les donnees paleontologiques (Excel) vers un JSON statique
consomme par le front React (web/src/data/taxa.json).
"""
import json
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.data_loader import load_all

OUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "web", "src", "data", "taxa.json",
)


def clean_value(v):
    if v is None:
        return None
    if isinstance(v, float) and math.isnan(v):
        return None
    try:
        import pandas as pd
        if pd.isna(v):
            return None
    except Exception:
        pass
    if isinstance(v, str):
        v = v.strip()
        return v if v else None
    return v


def main():
    df = load_all()
    df = df.where(df.notna(), None)

    records = []
    for i, row in df.iterrows():
        record = {"id": int(i)}
        for col in df.columns:
            record[col] = clean_value(row[col])
        records.append(record)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"{len(records)} taxons exportes vers {OUT_PATH}")


if __name__ == "__main__":
    main()
