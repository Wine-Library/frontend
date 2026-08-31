import { useAuth } from "@/context";
import favourites from "../../assets/icons/favourites-unactive.svg";
import favouritesActive from "@/assets/icons/Favourites (Heart Like).svg";
import { useFavourites } from "@/context/FavouritesContext";
import type { Wine } from "@/types";
import s from '../Wines/Wines.module.scss';
import React from "react";
import clsx from "clsx";

type Props = {
  wine: Wine;
  setShowAuthModal?: React.Dispatch<React.SetStateAction<boolean>>;
  // When provided, called instead of removing immediately so the caller can
  // play a removal animation before the item actually leaves favourites.
  onRemove?: (wineId: string) => void;
}

export const FavouritesButton: React.FC<Props> = React.memo(({ wine, setShowAuthModal, onRemove }) => {
  const { favouritesItems, addItemFavourites, removeItemFavourites } = useFavourites();
  const { user } = useAuth();
  const favourited = favouritesItems.some((item) => item.id === wine.id);

  const toggleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowAuthModal?.(true);
      return;
    }

    if (!favourited) return addItemFavourites(wine.id);
    return onRemove ? onRemove(wine.id) : removeItemFavourites(wine.id);
  }

  return (
    <button
      onClick={toggleFavourite}
      className={clsx(s.winesButtonsFavourites, favourited && s.winesButtonsFavouritesActive)}
    >
      <img
        src={favourited ? favouritesActive : favourites}
        alt={favourited ? "Remove from favourites" : "Add to favourites"}
        className={s.winesButtonsFavouritesIcon}
      />
    </button>
  )
})