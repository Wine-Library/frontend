// context/CartContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Wine, CartFavItem } from "@/types";
import { useAuth } from "./AuthContext";
import { addToCart, getCart, removeCartItem, updateCartItemQuantity, clearCart } from "../api/cart";

interface CartContextType {
  cartItems: CartFavItem[];
  cartLoading: boolean;
  addItemCart: (wine: Wine, quantity?: number) => Promise<void>;
  removeItemCart: (wineId: string) => Promise<void>;
  clearItemsCart: () => Promise<void>;
  changeQuantity: (wineId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "guest_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartFavItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      setCartLoading(true);
      if (!token) {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        setCartItems(saved ? JSON.parse(saved) : []);
        setCartLoading(false);
        return;
      }
      try {
        const data = await getCart();
        setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setCartLoading(false);
      }
    }

    loadCart();
  }, [token]);

  function changeQuantity(wineId: string, quantity: number) {
    const target = cartItems.find((item) => item.wine.id === wineId);

    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.wine.id === wineId ? { ...item, quantity } : item
      );

      if (!token) {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
      }

      return updated;
    });

    if (token && target?.cartItemId !== undefined) {
      updateCartItemQuantity(target.cartItemId, quantity).catch((err) => {
        console.error("Failed to update cart item quantity:", err);
      });
    }
  }

  async function addItemCart(wine: Wine, quantity: number = 1) {
    if (token) {
      try {
        await addToCart(wine.id);
        let updated = await getCart();

        if (quantity > 1) {
          const target = (Array.isArray(updated) ? updated : []).find(
            (item) => item.wine.id === wine.id
          );
          if (target?.cartItemId !== undefined) {
            await updateCartItemQuantity(target.cartItemId, quantity);
            updated = await getCart();
          }
        }

        setCartItems(Array.isArray(updated) ? updated : []);
      } catch (err) {
        console.error("Failed to add to cart:", err);
        throw err;
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.wine.id === wine.id);

        let updated: CartFavItem[];
        if (existing) {
          updated = prev.map((item) =>
            item.wine.id === wine.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updated = [...prev, { wine, quantity }];
        }

        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

  async function removeItemCart(wineId: string) {
    if (token) {
      const target = cartItems.find((item) => item.wine.id === wineId);
      if (target?.cartItemId === undefined) {
        console.error(`Cannot remove wine ${wineId}: no matching cart item id`);
        return;
      }

      try {
        await removeCartItem(target.cartItemId);
        setCartItems((prev) => prev.filter((item) => item.wine.id !== wineId));
      } catch (err) {
        console.error("Failed to remove from cart:", err);
        throw err;
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.wine.id !== wineId);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

  async function clearItemsCart() {
    if (token) {
      try {
        await clearCart();
        setCartItems([]);
      } catch (err) {
        console.error("Failed to clear cart:", err);
        throw err;
      }
    } else {
      setCartItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }

  return (
    <CartContext.Provider value={{ clearItemsCart, changeQuantity, cartItems, cartLoading, addItemCart, removeItemCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}