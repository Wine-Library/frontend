// components/WineCard/WineCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Wine } from "@/types";
import { CartButton } from "../CartButton/CartButton";
import { FavouritesButton } from "../FavouritesButton/FavouritesButton";

import s from '../Wines/Wines.module.scss';

type Props = {
  wine: Wine;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WineCard: React.FC<Props> = React.memo(({ wine, setShowAuthModal }) => {
  return (
    <div className={s.winesCard}>
      <Link to={`${wine.id}`} className={s.winesCardLink}>
        <img src={wine.productImage} alt="wine" className={s.winesImage} />
        <h3 className={s.winesName}>{wine.wineName}</h3>
        <span className={s.winesPrice}>${wine.price}</span>
        <p className={s.winesCountry}>
          {wine.countryOfOrigin}
        </p>
        <p className={s.winesType}>type: {wine.wineType}</p>
        <p className={s.winesType}>{wine.occasions}</p>
        <p className={s.winesType}>{wine.year}</p>
        <p className={s.winesRating}>{wine.popularityRating} ⭐</p>
      </Link>
      <div className={s.winesButtons}>
        <CartButton wine={wine} />
        <FavouritesButton setShowAuthModal={setShowAuthModal} wine={wine} />
      </div>
    </div>
  );
 }
)