import type { Taxon } from "../types";

/** The data has no separate Genre/Famille columns — Nom_taxon is "Genre espèce...".
 *  We derive the genus as its first token, which is the closest honest proxy
 *  to the charter's "genre → famille → ordre" browser without fabricating data. */
export function deriveGenre(nomTaxon: string | null): string {
  if (!nomTaxon) return "?";
  return nomTaxon.trim().split(/\s+/)[0];
}

export interface OrdreNode {
  ordre: string;
  count: number;
  genres: GenreNode[];
}

export interface GenreNode {
  genre: string;
  count: number;
  taxa: Taxon[];
}

export function buildTaxonomyTree(rows: Taxon[]): OrdreNode[] {
  const byOrdre = new Map<string, Taxon[]>();
  rows.forEach((row) => {
    const ordre = row["Groupe/Ordre"] ?? "Non renseigné";
    if (!byOrdre.has(ordre)) byOrdre.set(ordre, []);
    byOrdre.get(ordre)!.push(row);
  });

  return Array.from(byOrdre.entries())
    .map(([ordre, ordreRows]) => {
      const byGenre = new Map<string, Taxon[]>();
      ordreRows.forEach((row) => {
        const genre = deriveGenre(row.Nom_taxon);
        if (!byGenre.has(genre)) byGenre.set(genre, []);
        byGenre.get(genre)!.push(row);
      });
      const genres = Array.from(byGenre.entries())
        .map(([genre, taxa]) => ({ genre, count: taxa.length, taxa }))
        .sort((a, b) => a.genre.localeCompare(b.genre, "fr"));
      return { ordre, count: ordreRows.length, genres };
    })
    .sort((a, b) => b.count - a.count);
}
