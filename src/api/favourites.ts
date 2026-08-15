// api/favourites.ts
import { instance } from "./api";
import type { Wine } from "@/types";

export async function getFavourites(): Promise<Wine[]> {
  const { data } = await instance.get("/favourites");
  return data;
}

export async function addToFavourites(wineId: string): Promise<void> {
  const { data } = await instance.post("/favourites", { wineId });
  return data;
}

export async function removeItemFavourites(wineId: string): Promise<void> {
  await instance.delete(`/favourites/${wineId}`);
}