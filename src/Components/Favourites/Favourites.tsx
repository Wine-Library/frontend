/* eslint-disable max-len */
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { useFavourites } from '@/context/FavouritesContext';
import s from './Favourites.module.scss';
import favourites from '../../assets/icons/favourites.svg';
import { WineCard } from '../WineCard/WineCard';
import { useState } from 'react';
import AuthPage from '../Account/AuthPage';
import like from '../../assets/icons/like.svg';
import search from '../../assets/icons/search-white.svg';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const Favourites = () => {
  const { favouritesItems, removeItemFavourites } = useFavourites();
  const [showModal, setShowAuthModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleRemoveFavourite(wineId: string) {
    setDeletingId(wineId);
  }

  function handleAnimationEnd(e: React.AnimationEvent, wineId: string) {
    if (e.target !== e.currentTarget) return;
    if (wineId === deletingId) {
      removeItemFavourites(wineId);
      setDeletingId(null);
    }
  }

  return (
    <div className={s.favourites}>
      <Header />
      <div className={s.favouritesContent}>
        <div className={s.favouritesTop}>
          <div className={s.favouritesTitleWrap}>
            <div className={s.favouritesTitleImageWrap}>
              <img src={favourites} alt="" className="" />
            </div>
            <h1 className={s.favouritesTitle}>My Favourites</h1>
          </div>
          <div className={s.favouritesSub}>{favouritesItems.length} items</div>
        </div>
        <div className={s.favouritesItems}>
          {favouritesItems.length === 0 && (
            <div className={s.favouritesEmpty}>
              <div className={s.favouritesEmptyImageWrap}>
                <img src={like} alt="" className="" />
              </div>
              <div className={s.favouritesEmptyText}>
                <h2 className={s.favouritesEmptyTitle}>
                  No favourites yet
                </h2>
                <span className={s.favouritesEmptySubTitle}>
                  Start exploring our handpicked collections
                  of sustainable and organic wines to
                  save the bottles you love.
                </span>
                <button onClick={() => navigate('/wines')} className={s.favouritesEmptyButton}>
                  Browse Wines
                  <img src={search} alt="" className="" />
                </button>
              </div>
            </div>
          )}
          <div className={s.favouritesGrid}>
            {favouritesItems.map((wine) => (
              <div
                key={wine.id}
                onAnimationEnd={(e) => handleAnimationEnd(e, wine.id)}
                className={clsx(s.favouritesCardWrap, deletingId === wine.id && s.favouritesCardDeleting)}
              >
                <WineCard
                  wine={wine}
                  setShowAuthModal={setShowAuthModal}
                  onRemoveFavourite={handleRemoveFavourite}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && <AuthPage setShowAuthModal={setShowAuthModal} />}
      <Footer />
    </div>
  );
};
