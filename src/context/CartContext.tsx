import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Wine } from "@/types";
import { useAuth } from "./AuthContext";
import { addToCart, getCart, removeFromCart } from "../api/cart";

interface CartContextType {
  cartItems: Wine[];
  addItemCart: (wine: Wine) => Promise<void>;
  removeItemCart: (wineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "guest_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<Wine[]>([]);

  useEffect(() => {
    if (token) {
      // logged in — fetch from backend
      getCart(token).then(setCartItems).catch(console.error);
    } else {
      // guest — load from localStorage
      const saved = localStorage.getItem(GUEST_CART_KEY);
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [token]);

  async function addItemCart(wine: Wine) {
    if (token) {
      await addToCart(wine.id, token);
      const updated = await getCart(token);
      setCartItems(updated);
    } else {
      // guest — update local state + localStorage directly
      setCartItems((prev) => {
        const updated = [...prev, wine];
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

  async function removeItemCart(wineId: string) {
    if (token) {
      await removeFromCart(wineId, token);
      setCartItems((prev) => prev.filter((item) => item.id !== wineId));
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.id !== wineId);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, addItemCart, removeItemCart }}>
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