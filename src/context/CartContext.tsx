// context/CartContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Wine, CartItem } from "@/types";
import { useAuth } from "./AuthContext";
import { addToCart, getCart, removeFromCart, clearCart } from "../api/cart";

interface CartContextType {
  cartItems: CartItem[];
  addItemCart: (wine: Wine) => Promise<void>;
  removeItemCart: (wineId: string) => Promise<void>;
  clearItemsCart: () => Promise<void>;
  changeQuantity: (wineId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "guest_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  function changeQuantity(wineId: string, quantity: number) {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.wine.id === wineId ? { ...item, quantity } : item
      );

      if (!token) {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
      }

      return updated;
    });
  }

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
        const existing = prev.find((item) => item.wine.id === wine.id);

        let updated: CartItem[];
        if (existing) {
          updated = prev.map((item) =>
            item.wine.id === wine.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updated = [...prev, { wine, quantity: 1 }];
        }

        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

  async function removeItemCart(wineId: string) {
    if (token) {
      try {
        await removeFromCart(wineId);
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
        await clearCart(); // no wineId — clears everything on backend
        setCartItems([]); // reset local state too
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
    <CartContext.Provider value={{ clearItemsCart, changeQuantity, cartItems, addItemCart, removeItemCart }}>
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