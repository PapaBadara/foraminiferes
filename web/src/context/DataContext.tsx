import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import rawTaxa from "../data/taxa.json";
import type { Filters, Taxon } from "../types";

const allTaxa = rawTaxa as Taxon[];

function uniqueSorted(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort((a, b) =>
    a.localeCompare(b, "fr")
  );
}

interface DataContextValue {
  all: Taxon[];
  filtered: Taxon[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  options: {
    sources: string[];
    types: string[];
    classes: string[];
    ages: string[];
  };
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const options = useMemo(
    () => ({
      sources: uniqueSorted(allTaxa.map((t) => t.Source)),
      types: uniqueSorted(allTaxa.map((t) => t.Type)),
      classes: uniqueSorted(allTaxa.map((t) => t.Classe)),
      ages: uniqueSorted(allTaxa.map((t) => t["Age_géologique"])),
    }),
    []
  );

  const [filters, setFilters] = useState<Filters>({
    sources: options.sources,
    types: options.types,
    classes: options.classes,
    ages: options.ages,
  });

  const filtered = useMemo(
    () =>
      allTaxa.filter(
        (t) =>
          filters.sources.includes(t.Source) &&
          (t.Type === null || filters.types.includes(t.Type)) &&
          (t.Classe === null || filters.classes.includes(t.Classe)) &&
          (t["Age_géologique"] === null || filters.ages.includes(t["Age_géologique"]))
      ),
    [filters]
  );

  return (
    <DataContext.Provider value={{ all: allTaxa, filtered, filters, setFilters, options }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
