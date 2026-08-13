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
    async function loadCart() {
      if (!token) {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        setCartItems(saved ? JSON.parse(saved) : []);
        return;
      }
      try {
        const data = await getCart();
        setCartItems(data);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    }

    loadCart();
  }, [token]);

  async function addItemCart(wine: Wine) {
    if (token) {
      try {
        await addToCart(wine.id);
        const updated = await getCart();
        setCartItems(updated);
      } catch (err) {
        console.error("Failed to add to cart:", err);
        throw err;
      }
    } else {
      setCartItems((prev) => {
        const updated = [...prev, wine];
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

  async function removeItemCart(wineId: string) {
    if (token) {
      try {
        await removeFromCart(wineId);
        setCartItems((prev) => prev.filter((item) => item.id !== wineId));
      } catch (err) {
        console.error("Failed to remove from cart:", err);
        throw err;
      }
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