// api/cart.ts
import { instance } from "./api";

export async function getCart() {
  const { data } = await instance.get("/cart");
  return data;
}

export async function addToCart(wineId: string) {
  const { data } = await instance.post("/cart", { wineId });
  return data;
}

export async function removeFromCart(wineId: string) {
  const { data } = await instance.delete(`/cart/${wineId}`);
  return data;
}

export async function clearCart() {
  const { data } = await instance.delete("/cart");
  return data;
}