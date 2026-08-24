import { useAsync, useAsyncCallback } from "@/utils/hooks";
import { useEffect, useState } from "react";
import s from './WinePage.module.scss';
import { Header } from "../Header/Header";
import arrowRight from '../../assets/icons/Chevron (Arrow Right) grey.png';
import { NavLink, useParams } from "react-router-dom";
import clsx from "clsx";
import { FavouritesButton } from "../FavouritesButton/FavouritesButton";
import { CartButton } from "../CartButton/CartButton";
import AuthPage from "../Account/AuthPage";
import { getWineById, searchWines, type PageResponse } from "@/api/wines";
import type { Wine } from "@/types";
import { useCart } from "@/context/CartContext";
import star from '../../assets/icons/star.svg';
import { WineCard } from "../WineCard/WineCard";
import { Footer } from "../Footer/Footer";

const MAX_THUMBNAILS = 4;

export const WinePage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { cartItems, changeQuantity } = useCart();
  const { error, loading } = useAsyncCallback<void>();
  const { id } = useParams<{ id: string }>();
  const [wine, setWine] = useState<Wine | null>(null);
  const { data: winesPage } = useAsync<PageResponse<Wine>>(
    () => searchWines({ size: 1000 }),
    []
  );

  const item = cartItems.find((ci) => ci.wine.id === id);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
  }, [item?.quantity]);

  const updateQuantity = (next: number) => {
    const clamped = Math.max(1, next);
    setQuantity(clamped);
    if (item) {
      changeQuantity(id!, clamped);
    }
  };

  const wines = winesPage?.content ?? [];
  const topRatedWines = [...wines]
    .filter((w) => w.id !== id)
    .sort((a, b) => b.popularityRating - a.popularityRating)
    .slice(0, 3);

  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    async function fetchWine() {
      try {
        const found = await getWineById(id!);
        setWine(found);
        setActiveImage(found.productImage);
      } catch {
        setWine(null);
      }
    }
    fetchWine();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!wine) return <div>Wine not found</div>;

  const allImages = [wine.productImage];

  const visibleThumbnails = allImages.slice(0, MAX_THUMBNAILS);
  const hiddenCount = allImages.length - visibleThumbnails.length;

  return (
    <div className={s.wines}>
      <Header />
      {showAuthModal && <AuthPage setShowAuthModal={setShowAuthModal} />}
      <div className={s.wine}>
        <div className={s.winePath}>
          <NavLink className={s.wineNavink} to="/">
            <span className={s.wineSpan}>Home</span>
          </NavLink>
          <img src={arrowRight} alt="Home" className={s.winePathArrow} />
          <NavLink className={s.wineNavink} to="/Wines">
            <span className={s.wineSpan}>Wines</span>
          </NavLink>
          <img src={arrowRight} alt="Home" className={s.winePathArrow} />
          <p className={s.winePathName}>{wine.wineName}</p>
          {error && <p>{error.message}</p>}
        </div>
        <div className={s.wineContent}>
          <div className={s.wineLeft}>
            <div className={s.wineGallery}>
              <img src={activeImage} className={s.wineImage} alt={wine.wineName} />
            </div>

            <div className={s.wineThumbnails}>
              {visibleThumbnails.map((img, index) => {
                const isLastVisible = index === visibleThumbnails.length - 1;

                return (
                  <button
                    key={img + index}
                    type="button"
                    className={clsx(s.wineThumbnail, {
                      [s.wineThumbnailActive]: img === activeImage,
                    })}
                    onClick={() => setActiveImage(img)}
                    aria-label={`Show photo ${index + 1} of ${wine.wineName}`}
                  >
                    <img src={img} className={s.wineThumbnailImage} alt="" />

                    {isLastVisible && hiddenCount > 0 && (
                      <span className={s.wineThumbnailMore}>+{hiddenCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={s.wineRight}>
            <div className={s.wineTop}>
              <span className={clsx(s.wineOccacion, s.wineTopSpan)}>{wine.occasions.join(", ")}</span>
              <span className={clsx(s.wineRating)}>
                <img src={star} alt="" className="" />
                {wine.popularityRating}
              </span>
            </div>
            <div className={s.wineText}>
              <h1 className={s.wineTitle}>{wine.wineName}</h1>
              <div className={s.wineCountry}>
                <span className={s.wineCountrySpan}>{wine.countryOfOrigin} • {wine.year} • {wine.wineType} Wine</span>
              </div>
            </div>
            <span className={s.winePrice}>${wine.price}</span>
            <div className={s.wineButtons}>
              <div className={s.wineQuantityStepper}>
                <div className={clsx(s.wineQuantityStep, s.wineQuantityStepMinus)}>
                  <button
                    type="button"
                    className={s.wineQuantityStepSpan}
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                </div>
                <span className={s.wineQuantityNumber}>{quantity}</span>
                <div className={clsx(s.wineQuantityStep, s.wineQuantityStepPlus)}>
                  <button
                    type="button"
                    className={s.wineQuantityStepSpan}
                    onClick={() => updateQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <CartButton wine={wine} quantity={quantity} />
              <div className={s.wineFavourites}>
                <FavouritesButton wine={wine} setShowAuthModal={setShowAuthModal} />
              </div>
            </div>
            <div className={s.wineTasting}>
              <h3 className={s.wineTastingTitle}>Tasting Notes</h3>
              <p className={s.wineTastingDescription}>
                An incredibly nuanced vintage displaying a deep ruby hue.
                Notes of ripe blackcurrant, violets, and sweet cedar wood
                unfurl on the nose, followed by a velvety palate structured
                with fine-grained tannins and a mineral-rich botanical finish.
                Perfect for cellaring or exceptional celebrations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={s.wineTechnical}>
        <div className={s.winesTechnicalWrap}>
          <h2 className={s.wineTechnicalTitle}>Technical Specifications</h2>
          <ul className={s.wineTechnicalList}>
            <li className={s.wineTechnicalItem}>
              <h3 className={s.wineTechnicalItemTitle}>ALCOHOL BY VOLUME</h3>
              <span className={s.wineTechnicalItemSpan}>14.2%</span>
            </li>
            <li className={s.wineTechnicalItem}>
              <h3 className={s.wineTechnicalItemTitle}>SERVING TEMPERATURE</h3>
              <span className={s.wineTechnicalItemSpan}>16°C – 18°C</span>
            </li>
            <li className={s.wineTechnicalItem}>
              <h3 className={s.wineTechnicalItemTitle}>DECANTING TIME</h3>
              <span className={s.wineTechnicalItemSpan}>60–90 Minutes</span>
            </li>
            <li className={s.wineTechnicalItem}>
              <h3 className={s.wineTechnicalItemTitle}>RECOMMENDED PAIRINGS</h3>
              <span className={s.wineTechnicalItemSpan}>Ribeye Steak, Roast Lamb, Aged Gouda</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={s.wineAlsoLike}>
        <h2 className={s.wineAlsoLikeTitle}>
          You May Also Like
        </h2>
        <div className={s.wineTopGrid}>
          {topRatedWines.map((sortedWine) => (
            <WineCard key={sortedWine.id} wine={sortedWine} setShowAuthModal={setShowAuthModal} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};