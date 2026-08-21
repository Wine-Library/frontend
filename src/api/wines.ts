import { instance } from "./api";
import type { Wine } from "@/types";

export interface WineSearchParams {
  wineTypes?: string[];
  countriesOfOrigin?: string[];
  minPrice?: number;
  maxPrice?: number;
  minPopularityRating?: number;
  maxPopularityRating?: number;
  minYear?: number;
  maxYear?: number;
  page?: number;
  size?: number;
  sort?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1_000_000;
const DEFAULT_MIN_POPULARITY_RATING = 0;
const DEFAULT_MAX_POPULARITY_RATING = 5;
const DEFAULT_MIN_YEAR = 1900;
const DEFAULT_MAX_YEAR = new Date().getFullYear() + 1;

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function searchWines(params: WineSearchParams = {}): Promise<PageResponse<Wine>> {
  const query = new URLSearchParams();
  params.wineTypes?.forEach((t) => query.append("wineTypes", t));
  params.countriesOfOrigin?.forEach((c) => query.append("countriesOfOrigin", c));
  query.append("minPrice", String(params.minPrice ?? DEFAULT_MIN_PRICE));
  query.append("maxPrice", String(params.maxPrice ?? DEFAULT_MAX_PRICE));
  query.append("minPopularityRating", String(params.minPopularityRating ?? DEFAULT_MIN_POPULARITY_RATING));
  query.append("maxPopularityRating", String(params.maxPopularityRating ?? DEFAULT_MAX_POPULARITY_RATING));
  query.append("minYear", String(params.minYear ?? DEFAULT_MIN_YEAR));
  query.append("maxYear", String(params.maxYear ?? DEFAULT_MAX_YEAR));
  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.size !== undefined) query.append("size", String(params.size));
  if (params.sort) query.append("sort", params.sort);

  const { data } = await instance.get(`/wines/search?${query.toString()}`);
  return data;
}

export async function getWines(): Promise<Wine[]> {
  const { data } = await instance.get<PageResponse<Wine>>("/wines");
  return data.content;
}

export async function getWineById(id: string): Promise<Wine> {
  const { data } = await instance.get<Wine>(`/wines/${id}`);
  return data;
}