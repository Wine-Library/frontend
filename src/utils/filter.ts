import type { FilterMainWineTypes, FilterValue } from "@/types/Filter";

export const SORT_MAP: Record<FilterValue, string> = {
  Popular: 'popularityRating,desc',
  'Price: Low to High': 'price,asc',
  'Price: High to Low': 'price,desc',
};

export const WINE_TYPE_MAP: Partial<Record<FilterMainWineTypes, string>> = {
  'Red wines': 'RED',
  'White wines': 'WHITE',
  Sparkling: 'SPARKLING',
  'Dessert/fortified': 'DESSERT',
  Rosé: 'ROSE',
};

export function mapWineType(uiLabel: string): string | undefined {
  if (uiLabel === 'All') return undefined;
  return WINE_TYPE_MAP[uiLabel as FilterMainWineTypes];
}