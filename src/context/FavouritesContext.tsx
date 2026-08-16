import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Wine } from "@/types";
import { useAuth } from "./AuthContext";
import { addToFavourites, getFavourites, removeItemFavourites } from "../api/favourites";

interface FavouritesContextType {
  favouritesItems: Wine[];
  addItemFavourites: (wineId: string) => Promise<void>;
  removeItemFavourites: (wineId: string) => Promise<void>;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [favouritesItems, setFavouritesItems] = useState<Wine[]>([]);

  useEffect(() => {
    async function loadFavourites() {
      if (!token) {
        setFavouritesItems([]);
        return;
      }
      try {
        const data = await getFavourites();
        setFavouritesItems(data);
      } catch (err) {
        console.error("Failed to load favourites:", err);
      }
    }

    loadFavourites();
  }, [token]);

  async function addItemFavourites(wineId: string) {
    if (!token) {
      throw new Error("Must be logged in to add to Favourites");
    }

    try {
      await addToFavourites(wineId);
      const updated = await getFavourites();
      setFavouritesItems(updated);
    } catch (err) {
      console.error("Failed to add to favourites:", err);
      throw err;
    }
  }

  async function removeItemFavourites(wineId: string) {
    if (!token) {
      return;
    }

    try {
      await removeItemFavourites(wineId);
      setFavouritesItems((prev) => prev.filter((item) => item.id !== wineId));
    } catch (err) {
      console.error("Failed to remove from favourites:", err);
      throw err;
    }
  }

  return (
    <FavouritesContext.Provider value={{ favouritesItems, addItemFavourites, removeItemFavourites }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within FavouritesProvider");
  }
  return context;
}