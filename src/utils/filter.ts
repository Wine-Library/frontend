import type { Wine } from "@/types";
import type { FilterMainWineTypes, FilterValue } from "@/types/Filter";

export const SORT_MAP: Record<FilterValue, string> = {
  Popular: 'popularityRating,desc',
  'Price: Low to High': 'price,asc',
  'Price: High to Low': 'price,desc',
};

export const WINE_TYPE_MAP: Partial<Record<FilterMainWineTypes, string>> = {
  Red: 'Red',
  White: 'White',
  Sparkling: 'Sparkling',
  Rose: 'Rose',
};

export function mapWineType(uiLabel: string): string | undefined {
  if (uiLabel === 'All') return undefined;
  return WINE_TYPE_MAP[uiLabel as FilterMainWineTypes];
}

export function getUniqueCountries(wines: Wine[]): string[] {
  return Array.from(new Set(wines.map((w) => w.countryOfOrigin))).sort();
}