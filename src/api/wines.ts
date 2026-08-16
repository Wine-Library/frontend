import { instance } from "./api";
import type { Wine } from "@/types";
import { mockWines } from "@/mocks/wines";

const USE_MOCK = false;

export interface WineSearchParams {
  wineTypes?: string[];
  countriesOfOrigin?: string[];
  minPrice?: number;
  maxPrice?: number;
  minPopularityRating?: number;
  maxPopularityRating?: number;
  page?: number;
  size?: number;
  sort?: string; // e.g. "price,asc"
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
      setTimeout(() => resolve({
        content: mockWines,
        totalElements: mockWines.length,
        totalPages: 1,
        number: 0,
        size: mockWines.length,
      }), 500);
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