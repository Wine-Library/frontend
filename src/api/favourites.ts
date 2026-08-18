// api/favourites.ts
import { instance } from "./api";
import type { Wine } from "@/types";

// The real routes (per the backend's OpenAPI spec) live under /users/favorites
// (American spelling, no "favourites"/"favourite" alias exists), and add/remove
// take the wine id as a path segment rather than a request body.
export async function getFavourites(): Promise<Wine[]> {
  const { data } = await instance.get("/users/favorites");
  return data?.content ?? [];
}

export async function addToFavourites(wineId: string): Promise<void> {
  await instance.post(`/users/favorites/${wineId}`);
}

export async function removeItemFavourites(wineId: string): Promise<void> {
  await instance.delete(`/users/favorites/${wineId}`);
}