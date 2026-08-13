import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Wine } from "@/types";
import { useAuth } from "./AuthContext";
import { addToFavourites, getFavourites, removeFromFavourites } from "../api/favourites";

interface FavouritesContextType {
  favouritesItems: Wine[];
  addItemFavourites: (wineId: string) => Promise<void>;
  removeItemFavorites: (wineId: string) => Promise<void>;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [favouritesItems, setFavouritesItems] = useState<Wine[]>([]);

  useEffect(() => {
    if (token) {
      getFavourites(token).then(setFavouritesItems).catch(console.error);
    } else {
      setFavouritesItems([]);
    }
  }, [token]);
  
  async function addItemFavourites(wineId: string) {
    if (!token) {
      throw new Error("Must be logged in to add to Favourites");
    }
    
    await addToFavourites(wineId, token);
    const updated = await getFavourites(token);
    setFavouritesItems(updated);
  }

  async function removeItemFavorites(wineId: string) {
    if (!token) {
      return;
    }

    await removeFromFavourites(wineId, token);
    setFavouritesItems(prev => prev.filter(item => item.id !== wineId));
  }

  return (
    <FavouritesContext.Provider value={{ favouritesItems, addItemFavourites, removeItemFavorites }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within FavouritesProvider");
  }

  return context;
}