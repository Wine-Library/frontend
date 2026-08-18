import { useAsyncCallback } from "@/utils/hooks";
import { useEffect, useState } from "react";
import s from './WinePage.module.scss';
import { Header } from "../Header/Header";
import home from '../../assets/icons/Home.svg';
import arrowRight from '../../assets/icons/Chevron (Arrow Right) grey.png';
import { NavLink, useParams } from "react-router-dom";
import arrowLeft from '../../assets/icons/Chevron (Arrow Left).svg';
import clsx from "clsx";
import { FavouritesButton } from "../FavouritesButton/FavouritesButton";
import { CartButton } from "../CartButton/CartButton";
import AuthPage from "../Account/AuthPage";
import { getWineById } from "@/api/wines";
import type { Wine } from "@/types";

export const WinePage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { error, loading } = useAsyncCallback<void>();
  const { id } = useParams<{ id: string }>();
  const [wine, setWine] = useState<Wine | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchWine() {
      try {
        const found = await getWineById(id!);
        setWine(found);
      } catch {
        setWine(null);
      }
    }
    fetchWine();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!wine) return <div>Wine not found</div>;

  return (
    <div className={s.wines}>
      <Header />
      {showAuthModal && <AuthPage setShowAuthModal={setShowAuthModal} />}
      <div className={s.wine}>
        <div className={s.winePath}>
          <NavLink to="/">
            <img src={home} alt="Home" className={s.winePathHome} />
          </NavLink>
          <img src={arrowRight} alt="Home" className={s.winePathArrow} />
          <span className={s.wineSpan}>Wines {id}</span>
          <img src={arrowRight} alt="Home" className={s.winePathArrow} />
          <p className={s.wineName}>{wine.wineName}</p>
          {error && <p>{error.message}</p>}
        </div>
        <NavLink to="/" className={s.wineBack}>
          <img src={arrowLeft} alt="Home" className={s.wineBackArrow} />
          <span className={s.wineBackText}>Back</span>
        </NavLink>
        <div className={s.wineContent}>
          <div className={s.wineLeft}>
            <h1 className={s.wineTitle}>{wine.wineName}</h1>
            <div className={s.wineGallery}>
              <img src={wine.productImage} className={s.wineImage} alt={wine.wineName} />
            </div>
          </div>
          <div className={s.wineRight}>
            <span className={s.winePrice}>${wine.price}</span>
            <span className={s.wineSpan}>{wine.wineName}</span>
            <span className={clsx(s.wineSpan)}>Type: {wine.wineType}</span>
            <div className={s.wineCountry}>
              <span className={s.wineSpan}>{wine.countryOfOrigin}</span>
            </div>
            <span className={s.wineSpan}>{wine.popularityRating}⭐</span>
            <div className={s.wineButtons}>
              <CartButton wine={wine} />
              <FavouritesButton wine={wine} setShowAuthModal={setShowAuthModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};