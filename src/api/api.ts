import { mockWines } from "@/mocks/wines";
import type { Wine } from "@/types";

// api/wines.ts
const USE_MOCK = true;

export async function getWines(): Promise<Wine[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWines), 500); // fake network delay
    });
  }

  const BASE_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${BASE_URL}/wines`);
  if (!res.ok) throw new Error("Failed to fetch wines");
  return res.json();
}