/* eslint-disable max-len */
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import ArrowGray from '../../assets/icons/Chevron (Arrow Right) grey.png';
import Home from '../../assets/icons/Home.svg';
import { Link } from 'react-router-dom';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/CartContext';
import s from './Favourites.module.scss';
import clsx from 'clsx';
import favourites from '../../assets/icons/Favourites (Heart Like).svg';
import favouritesActive from '../../assets/icons/ActiveFav.svg';

export const Favourites = () => {
  const {cartItems, addItemCart, removeItemCart} = useCart();
  const { favouritesItems, addItemFavourites, removeItemFavourites } = useFavourites();
  
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
            {favouritesItems.map((wine) => {
            const favourited = favouritesItems.some(item => item.id === wine.id);
            const carted = cartItems.some((item) => item.wine.id === wine.id);

            return (
            <Link to={`${wine.id}`} className={s.favouritesCard} key={wine.id}>
              <img src={wine.imageUrl} alt="wine" className={s.favouritesImage} />
              <h3 className={s.favouritesName}>{wine.name}</h3>
              <span className={s.favouritesPrice}>${wine.price}</span>
              <p className={s.favouritesCountry}>{wine.originCountry} <img src={wine.flagUrl} alt="" className={s.favouritesFlag} /></p>
              <p className={s.favouritesRating}>{wine.popularityRating} ⭐</p>
              <div className={s.favouritesButtons}>
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
                    className={clsx(s.favouritesButtonsCart, carted && s.favouritesButtonsCartActive)}
                    >
                      {carted ? 'Added to cart' : 'Add to cart'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    
                      if (favourited) {
                        removeItemFavourites(wine.id).catch(console.error);
                      } else {
                        addItemFavourites(wine.id).catch(console.error);
                      }
                    }}
                    className={clsx(s.favouritesButtonsFavourites, favourited && s.favouritesButtonsFavouritesActive)}
                  >
                    <img
                      src={favourited ? favouritesActive : favourites}
                      alt={favourited ? "Remove from favourites" : "Add to favourites"}
                      className={s.favouritesButtonsFavouritesIcon}
                    />
                  </button>
              </div>
            </Link>
          )})}
          </div>
        </div>
      </div>
      <div className={s.favouritesFooter}>
        <Footer />
      </div>
    </div>
  );
};
