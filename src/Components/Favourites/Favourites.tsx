/* eslint-disable max-len */
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import ArrowGray from '../../assets/icons/Chevron (Arrow Right) grey.png';
import Home from '../../assets/icons/Home.svg';
import { Link } from 'react-router-dom';
import { useFavourites } from '@/context/FavouritesContext';
import s from './Favourites.module.scss';
import { FavouritesCard } from '../FavouritesCard/FavouritesCard';

export const Favourites = () => {
  const { favouritesItems } = useFavourites();
  
  return (
    <div className={s.favourites}>
      <div className={s.favouritesHeader}>
        <Header />
      </div>
      <div className={s.favouritesContent}>
        <div className={s.favouritesPath}>
          <Link to="/">
            <img src={Home} alt="" />
          </Link>
          <img src={ArrowGray} alt="" />
          <span className={s.favouritesPathName}>Favourites</span>
        </div>
        <h1 className={s.favouritesTitle}>Favourites</h1>
        <div className={s.favouritesSub}>{favouritesItems.length} items</div>
        <div className={s.favouritesItems}>
          {favouritesItems.length === 0 && (
            <span className={s.favouritesItemsEmpty}>
              Your favourites list is empty
            </span>
          )}
          <div className={s.favouritesGrid}>
            {favouritesItems.map((wine) => (
                <FavouritesCard wine={wine} />
              ))}
          </div>
        </div>
      </div>
      <div className={s.favouritesFooter}>
        <Footer />
      </div>
    </div>
  );
};
