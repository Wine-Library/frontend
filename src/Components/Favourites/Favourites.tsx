/* eslint-disable max-len */
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { useFavourites } from '@/context/FavouritesContext';
import s from './Favourites.module.scss';
import favourites from '../../assets/icons/favourites.svg';
import { WineCard } from '../WineCard/WineCard';
import { useState } from 'react';

export const Favourites = () => {
  const { favouritesItems } = useFavourites();
  const [showModal, setShowAuthModal] = useState(false);
  
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
            <span className={s.favouritesItemsEmpty}>
              Your favourites list is empty
            </span>
          )}
          <div className={s.favouritesGrid}>
            {favouritesItems.map((wine) => (
                <WineCard wine={wine} setShowAuthModal={setShowAuthModal} />
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
