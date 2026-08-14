// components/WineCard/WineCard.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/context";
import { useCart } from "@/context/CartContext";
import { useFavourites } from "@/context/FavouritesContext";
import type { Wine } from "@/types";
import s from "../Wines/Wines.module.scss";
import favourites from "@/assets/icons/Favourites (Heart Like).svg";
import favouritesActive from "@/assets/icons/ActiveFav.svg";

type Props = {
  wine: Wine;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WineCard: React.FC<Props> = React.memo(({ wine, setShowAuthModal }) => {
  const { user } = useAuth();
  const { cartItems, addItemCart, removeItemCart } = useCart();
  const { favouritesItems, addItemFavourites, removeItemFavorites } = useFavourites();

  const favourited = favouritesItems.some((item) => item.id === wine.id);
  const carted = cartItems.some((item) => item.wine.id === wine.id);

  return (
    <Link to={`${wine.id}`} className={s.winesCard}>
      <img src={wine.imageUrl} alt="wine" className={s.winesImage} />
      <h3 className={s.winesName}>{wine.name}</h3>
      <span className={s.winesPrice}>${wine.price}</span>
      <p className={s.winesCountry}>
        {wine.originCountry} <img src={wine.flagUrl} alt="" className={s.winesFlag} />
      </p>
      <p className={s.winesRating}>{wine.popularityRating} ⭐</p>
      <div className={s.winesButtons}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (carted) {
              removeItemCart(wine.id).catch(console.error);
            } else {
              addItemCart(wine).catch(console.error);
            }
          }}
          className={clsx(s.winesButtonsCart, carted && s.winesButtonsCartActive)}
        >
          {carted ? "Added to cart" : "Add to cart"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!user) {
              setShowAuthModal(true);
              return;
            }
            if (favourited) {
              removeItemFavorites(wine.id).catch(console.error);
            } else {
              addItemFavourites(wine.id).catch(console.error);
            }
          }}
          className={clsx(s.winesButtonsFavourites, favourited && s.winesButtonsFavouritesActive)}
        >
          <img
            src={favourited ? favouritesActive : favourites}
            alt={favourited ? "Remove from favourites" : "Add to favourites"}
            className={s.winesButtonsFavouritesIcon}
          />
        </button>
      </div>
    </Link>
  );
});