import s from './TopBar.module.scss';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import React from 'react';
import { getLink, getLinkClass, navLinks } from '@/utils';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/CartContext';
import topBarLogo from '../../assets/WineLibraryLogo.png';

import basket from '../../assets/icons/Shopping bag (Cart).svg';
import favourites from '../../assets/icons/Favourites (Heart Like).svg';

export const TopBar: React.FC = () => {
  const { favouritesItems } = useFavourites();
  const { cartItems } = useCart();

  return (
    <div className={classNames(s.topBar, s.favouritesTop)}>
      <div className={classNames(s.nav, s.menuNav)}>
        <Link to="#">
          <img className={s.topBarLogo} src={topBarLogo} alt="Logo" />
        </Link>
        <nav className={s.nav}>
          <ul className={s.navList}>
            {navLinks.map(link => (
              <li className={s.navItem} key={link.to}>
                <NavLink to={link.to} className={getLinkClass(s)}>
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={s.navVectors}>
        <NavLink to="/favourites" className={getLink(s)}>
          <span className={classNames(s.navFav, s.navButton)}>
            <img src={favourites} aria-label="Favourites" className={s.navFavImg} alt="Favourites" />
              {favouritesItems.length === 0 ? '' : <div className={classNames(s.navCount, s.navCountFav)}>
              <span className={s.navCountNumber}>{favouritesItems.length}</span>
            </div>}
          </span>
        </NavLink>
        <NavLink to="/basket" className={getLink(s)}>
          <span className={classNames(s.navBasket, s.navButton)}>
            <img src={basket} aria-label="Basket" className={s.navBasketImg} alt="basket" />
            {cartItems.length === 0 ? '' : <div className={s.navCount}>
              <span className={s.navCountNumber}>{cartItems.length}</span>
            </div>}
          </span>
        </NavLink>
      </div>
      {/* <a href="#" className={s.headerMenu}>
        <button
          className={classNames(s.headerButton, s.headerButtonMenu)}
        >
          <img src="" aria-label="Menu" className={s.headerMenuImg} alt="Menu" />
        </button>
      </a> */}
    </div>
  );
};
