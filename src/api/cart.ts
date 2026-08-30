// api/cart.ts
import { instance } from "./api";
import type { CartFavItem } from "@/types";
import { getWineById } from "./wines";

interface RawCartItem {
  id: number;
  wineId: string;
  quantity: number;
}

async function getRawCartItems(): Promise<RawCartItem[]> {
  const { data } = await instance.get("/cart");
  // The backend wraps the cart in an object ({ id, userId, cartItems }) whose
  // items are flat { id, wineId, quantity } pairs — no nested wine data.
  return data?.cartItems ?? [];
}

export async function getCart(): Promise<CartFavItem[]> {
  const rawItems = await getRawCartItems();

  // The rest of the app expects { wine, quantity }, so hydrate each line with
  // its wine, keeping the backend's own cart-item id for later remove/update
  // calls (those are keyed by cart-item id, not wine id).
  const items = await Promise.all(
    rawItems.map(async (item): Promise<CartFavItem | null> => {
      try {
        const wine = await getWineById(String(item.wineId));
        return { wine, quantity: item.quantity, cartItemId: item.id };
      } catch (err) {
        console.error(`Failed to load wine ${item.wineId} for cart item:`, err);
        return null;
      }
    })
  );

  return items.filter((item): item is CartFavItem => item !== null);
}

export async function addToCart(wineId: string, quantity = 1) {
  const { data } = await instance.post("/cart", { wineId, quantity });
  return data;
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const { data } = await instance.put(`/cart/items/${cartItemId}`, { quantity });
  return data;
}

export async function removeCartItem(cartItemId: number) {
  const { data } = await instance.delete(`/cart/items/${cartItemId}`);
  return data;
}

// There is no bulk "clear cart" / checkout endpoint on the backend — clearing
// means removing every line item individually.
export async function clearCart() {
  const rawItems = await getRawCartItems();
  await Promise.all(rawItems.map((item) => removeCartItem(item.id)));
}