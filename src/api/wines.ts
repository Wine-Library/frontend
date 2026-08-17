import { instance } from "./api";
import type { Wine } from "@/types";
import { mockWines } from "@/mocks/wines";
import { mapWineType } from "@/utils/filter";

const USE_MOCK = true;

export interface WineSearchParams {
  wineTypes?: string[];
  countriesOfOrigin?: string[];
  minPrice?: number;
  maxPrice?: number;
  minPopularityRating?: number;
  maxPopularityRating?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function searchWines(params: WineSearchParams = {}): Promise<PageResponse<Wine>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = mockWines;

        if (params.wineTypes?.length) {
          filtered = filtered.filter((w) => params.wineTypes!.includes(mapWineType(w.type) ?? w.type));
        }
        if (params.countriesOfOrigin?.length) {
          filtered = filtered.filter((w) => params.countriesOfOrigin!.includes(w.originCountry));
        }
        if (params.minPrice !== undefined) {
          filtered = filtered.filter((w) => w.price >= params.minPrice!);
        }
        if (params.maxPrice !== undefined) {
          filtered = filtered.filter((w) => w.price <= params.maxPrice!);
        }
        if (params.minPopularityRating !== undefined) {
          filtered = filtered.filter((w) => w.popularityRating >= params.minPopularityRating!);
        }
        if (params.maxPopularityRating !== undefined) {
          filtered = filtered.filter((w) => w.popularityRating <= params.maxPopularityRating!);
        }

        if (params.sort) {
          const [field, direction] = params.sort.split(",");
          filtered = [...filtered].sort((a, b) => {
            const aValue = Number(a[field as keyof Wine] ?? 0);
            const bValue = Number(b[field as keyof Wine] ?? 0);
            return direction === "desc" ? bValue - aValue : aValue - bValue;
          });
        }

        const size = params.size ?? filtered.length;
        const page = params.page ?? 0;
        const start = page * size;
        const content = filtered.slice(start, start + size);

        resolve({
          content,
          totalElements: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / size)),
          number: page,
          size,
        });
      }, 500);
    });
  }

  const query = new URLSearchParams();
  params.wineTypes?.forEach((t) => query.append("wineTypes", t));
  params.countriesOfOrigin?.forEach((c) => query.append("countriesOfOrigin", c));
  if (params.minPrice !== undefined) query.append("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.append("maxPrice", String(params.maxPrice));
  if (params.minPopularityRating !== undefined) query.append("minPopularityRating", String(params.minPopularityRating));
  if (params.maxPopularityRating !== undefined) query.append("maxPopularityRating", String(params.maxPopularityRating));
  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.size !== undefined) query.append("size", String(params.size));
  if (params.sort) query.append("sort", params.sort);

  const { data } = await instance.get(`/wines/search?${query.toString()}`);
  return data;
}

export async function getWines(): Promise<Wine[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWines), 500);
    });
  }
  const { data } = await instance.get("/wines");
  return data;
}