export interface Occurrence {
  id: string;
  taxon_id: string;
  nom_taxon: string;
  groupe: "Foraminifère" | "Ostracode";
  sous_type: "Benthique" | "Planctonique" | null;
  regne: string | null;
  embranchement: string | null;
  classe: string | null;
  groupe_ordre: string | null;
  decouvreur: string | null;
  photo: string | null;
  locality_id: string;
  locality_nom: string | null;
  locality_type: string | null;
  bassin: string | null;
  longitude: number | null;
  latitude: number | null;
  reference_id: string;
  reference_citation: string | null;
  site_detail: string | null;
  age: string | null;
  biozones: string | null;
  stratigraphie: string | null;
  formation: string | null;
  paleoenv: string | null;
  paleogeo: string | null;
  description: string | null;
  n_collection: string | null;
  notes: string | null;
  source_file: string | null;
}

export interface Reference {
  id: string;
  citation: string | null;
  annee: number | null;
  revue: string | null;
  titre: string | null;
}

/** One row per unique taxon, aggregating all of its occurrences. */
export interface TaxonGroup {
  taxon_id: string;
  nom_taxon: string;
  groupe: Occurrence["groupe"];
  sous_type: Occurrence["sous_type"];
  regne: string | null;
  embranchement: string | null;
  classe: string | null;
  groupe_ordre: string | null;
  decouvreur: string | null;
  photo: string | null;
  occurrences: Occurrence[];
}

export interface Filters {
  groupes: string[];
  sousTypes: string[];
  classes: string[];
  ages: string[];
  bassins: string[];
  references: string[];
}
