import { useAsyncCallback } from "@/utils/hooks";
import { useState, type SetStateAction } from "react";
import s from './WinePage.module.scss';
import type { Wine } from "@/types";
import { Header } from "../Header/Header";
import home from '../../assets/icons/Home.svg';
import arrowRight from '../../assets/icons/Chevron (Arrow Right) grey.png';
import { NavLink, useParams } from "react-router-dom";
import { mockWines } from "@/mocks/wines";
import arrowLeft from '../../assets/icons/Chevron (Arrow Left).svg';
import clsx from "clsx";
import { FavouritesButton } from "../FavouritesButton/FavouritesButton";
import { CartButton } from "../CartButton/CartButton";
import AuthPage from "../Account/AuthPage";

export const WinePage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { loading, error, execute } = useAsyncCallback<void>();
  const { id } = useParams<{ id: string }>();
  const wine = mockWines.find((w) => String(w.id) === id);
  
  const [currentImage, setCurrentImage] = useState<string | undefined>(wine?.imageUrl?.[0]);

  if (!wine) return <div>Wine not found</div>;

  function handleCurrentImage(image: string) {
    setCurrentImage(image);
  }
  
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
          <p className={s.wineName}>{wine.name}</p>
          {!wine && <p>{error?.message}</p>}
        </div>
        <NavLink to="/" className={s.wineBack}>
          <img src={arrowLeft} alt="Home" className={s.wineBackArrow} />
          <span className={s.wineBackText}>Back</span>
        </NavLink>
        <div className={s.wineContent}>
          <div className={s.wineLeft}>
            <h1 className={s.wineTitle}>
              {wine.name}
            </h1>
            <div className={s.wineGallery}>
              <div className={s.wineThumbnails}>
                {wine.imageUrl.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => handleCurrentImage(img)}
                    className={clsx(s.wineThumbnail, img === currentImage && s.wineThumbnailActive)}
                  >
                    <img src={img} className={s.wineThumbnailImage} alt={wine.name} />
                  </button>
                ))}
              </div>
              <img src={currentImage} className={s.wineImage} alt={wine.name} />
            </div>
          </div>
          <div className={s.wineRight}>
            <span className={s.winePrice}>${wine.price}</span>
            <span className={s.wineSpan}>{wine.name}</span>
            <span className={clsx(s.wineSpan)}>Type: {wine.type}</span>
            <div className={s.wineCountry}>
              <span className={s.wineSpan}>{wine.originCountry}</span>
              <img src={wine.flagUrl} alt="flag" className={s.wineFlag} />
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
 }
