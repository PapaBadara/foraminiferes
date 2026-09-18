export interface Taxon {
  id: number;
  Nom_taxon: string | null;
  Type: string | null;
  "Règne": string | null;
  Embranchement: string | null;
  Classe: string | null;
  "Groupe/Ordre": string | null;
  "Age_géologique": string | null;
  "Lieu_découverte": string | null;
  "Découvreur (auteur taxonomique)": string | null;
  Auteur_site: string | null;
  Illustration: string | null;
  Description: string | null;
  "Paléoenvironnement": string | null;
  "Paléogéographie": string | null;
  Biozones: string | null;
  Stratigraphie: string | null;
  From_m: number | null;
  To_m: number | null;
  "Notes+": string | null;
  longitude: number | null;
  latitude: number | null;
  Source: string;
  "Année": number;
}

export interface Filters {
  sources: string[];
  types: string[];
  classes: string[];
  ages: string[];
}
