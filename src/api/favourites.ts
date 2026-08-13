import type { Wine } from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getFavourites(token: string): Promise<Wine[]> {
  const res = await fetch(`${BASE_URL}/favourites`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  const data = await res.json();
  return data;
}

export async function addToFavourites(wineId: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/favourites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },
    body: JSON.stringify({ wineId }),
  })

  if (!res.ok) {
    throw new Error(`Failed to add to favorites`);
  }

  const data = await res.json();
  return data;
}

export async function removeFromFavourites(wineId: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/favourites/${wineId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to remove from favorites");
  }
}