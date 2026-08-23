// components/WineCard/WineCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Wine } from "@/types";
import { CartButton } from "../CartButton/CartButton";
import { FavouritesButton } from "../FavouritesButton/FavouritesButton";

import s from '../Wines/Wines.module.scss';
import star from "../../assets/icons/star.svg";

type Props = {
  wine: Wine;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WineCard: React.FC<Props> = React.memo(({ wine, setShowAuthModal }) => {
  return (
    <div className={s.winesCard}>
      <Link to={`${wine.id}`} className={s.winesCardLink}>
        <div className={s.wineTop}>
          <p className={s.winesOccacions}>{wine.occasions}</p>
          <div className={s.wineTopRight}>
            <p className={s.winesRating}>
              <img src={star} alt="" className="" />
              {wine.popularityRating}
            </p>
            <FavouritesButton setShowAuthModal={setShowAuthModal} wine={wine} />
          </div>
        </div>
        <div className={s.winesImageWrap}>
          <img src={wine.productImage} alt="wine" className={s.winesImage} />
        </div>
        <div className={s.winesBottom}>
          <p className={s.winesCountry}>
            {wine.countryOfOrigin} • {wine.year}
          </p>
          <h3 className={s.winesName}>La Villa Rosé</h3>
          <p className={s.winesType}>{wine.wineType} Wine</p>
        </div>
        <span className={s.winesPrice}>
          <span className={s.winesPriceGreen}>
            ${wine.price}
          </span>
          / bottle
        </span>
        <CartButton wine={wine} />
      </Link>
    </div>
  );
 }
)