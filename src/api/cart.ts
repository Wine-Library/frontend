import type { Wine } from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getCart(token: string): Promise<Wine[]> {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  const data = await res.json();
  return data;
}

export async function addToCart(wineId: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },
    body: JSON.stringify({ wineId }),
  })

  if (!res.ok) {
    throw new Error(`Failed to add to cart`);
  }

  const data = await res.json();
  return data;
}

export async function removeFromCart(wineId: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/cart/${wineId}`, {
    method: "DELELE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to remove from cart");
  }
}