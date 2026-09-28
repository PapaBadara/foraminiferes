import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import rawOccurrences from "../data/occurrences.json";
import rawReferences from "../data/references.json";
import type { Filters, Occurrence, Reference, TaxonGroup } from "../types";

const allOccurrences = rawOccurrences as Occurrence[];
const allReferences = rawReferences as Reference[];

function uniqueSorted(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort((a, b) =>
    a.localeCompare(b, "fr")
  );
}

export function groupByTaxon(rows: Occurrence[]): TaxonGroup[] {
  const groups = new Map<string, TaxonGroup>();
  rows.forEach((occ) => {
    if (!groups.has(occ.taxon_id)) {
      groups.set(occ.taxon_id, {
        taxon_id: occ.taxon_id,
        nom_taxon: occ.nom_taxon,
        groupe: occ.groupe,
        sous_type: occ.sous_type,
        regne: occ.regne,
        embranchement: occ.embranchement,
        classe: occ.classe,
        groupe_ordre: occ.groupe_ordre,
        decouvreur: occ.decouvreur,
        photo: occ.photo,
        occurrences: [],
      });
    }
    groups.get(occ.taxon_id)!.occurrences.push(occ);
  });
  return Array.from(groups.values()).sort((a, b) => a.nom_taxon.localeCompare(b.nom_taxon, "fr"));
}

interface DataContextValue {
  all: Occurrence[];
  filtered: Occurrence[];
  references: Reference[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  options: {
    groupes: string[];
    sousTypes: string[];
    classes: string[];
    ages: string[];
    bassins: string[];
    references: string[];
  };
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const options = useMemo(
    () => ({
      groupes: uniqueSorted(allOccurrences.map((t) => t.groupe)),
      sousTypes: uniqueSorted(allOccurrences.map((t) => t.sous_type)),
      classes: uniqueSorted(allOccurrences.map((t) => t.classe)),
      ages: uniqueSorted(allOccurrences.map((t) => t.age)),
      bassins: uniqueSorted(allOccurrences.map((t) => t.bassin)),
      references: uniqueSorted(allOccurrences.map((t) => t.reference_citation)),
    }),
    []
  );

  const [filters, setFilters] = useState<Filters>({
    groupes: options.groupes,
    sousTypes: options.sousTypes,
    classes: options.classes,
    ages: options.ages,
    bassins: options.bassins,
    references: options.references,
  });

  const filtered = useMemo(
    () =>
      allOccurrences.filter(
        (t) =>
          filters.groupes.includes(t.groupe) &&
          (t.sous_type === null || filters.sousTypes.includes(t.sous_type)) &&
          (t.classe === null || filters.classes.includes(t.classe)) &&
          (t.age === null || filters.ages.includes(t.age)) &&
          (t.bassin === null || filters.bassins.includes(t.bassin)) &&
          (t.reference_citation === null || filters.references.includes(t.reference_citation))
      ),
    [filters]
  );

  return (
    <DataContext.Provider
      value={{ all: allOccurrences, filtered, references: allReferences, filters, setFilters, options }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
