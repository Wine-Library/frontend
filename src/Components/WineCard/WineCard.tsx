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
  // When provided, lets the parent (e.g. the Favourites page) play a removal
  // animation before the wine actually leaves favourites.
  onRemoveFavourite?: (wineId: string) => void;
};

export const WineCard: React.FC<Props> = React.memo(({ wine, setShowAuthModal, onRemoveFavourite }) => {
  return (
    <div className={s.winesCard}>
      <div className={s.winesCardLink}>
        <Link
          to={`/Wines/${wine.id}`}
          className={s.winesCardOverlay}
          aria-label={wine.wineName}
        />
        <div className={s.wineTop}>
          <p className={s.winesOccacions}>{wine.occasions}</p>
          <div className={s.wineTopRight}>
            <p className={s.winesRating}>
              <img src={star} alt="" className="" />
              {wine.popularityRating}
            </p>
            <FavouritesButton setShowAuthModal={setShowAuthModal} wine={wine} onRemove={onRemoveFavourite} />
          </div>
        </div>
        <div className={s.winesImageWrap}>
          <img src={wine.productImage} alt="wine" className={s.winesImage} />
        </div>
        <div className={s.winesBottom}>
          <p className={s.winesCountry}>
            {wine.countryOfOrigin} • {wine.year}
          </p>
          <h3 className={s.winesName}>{wine.wineName}</h3>
          <p className={s.winesType}>{wine.wineType} Wine</p>
        </div>
        <div className={s.winesButton}>
          <span className={s.winesPrice}>
            <span className={s.winesPriceGreen}>
              ${wine.price}
            </span>
            / bottle
          </span>
          <CartButton wine={wine} />
        </div>
      </div>
    </div>
  );
 }
)