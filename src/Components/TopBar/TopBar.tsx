import s from './TopBar.module.scss';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import React from 'react';
import { getLink, getLinkClass, navLinks } from '@/utils';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/CartContext';

import basket from '../../assets/icons/shopping-bag.svg';

import profile from '../../assets/icons/user.svg';
import favourites from '../../assets/icons/heart.svg';
import { Search } from '../Search/Search';

type Props = {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isSearch: boolean;
  query?: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
  onSearchClick?: () => void;
};

export const TopBar: React.FC<Props> = ({ onSearchClick, setIsSearch, isSearch, query, setQuery }) => {
  const { favouritesItems } = useFavourites();
  const { cartItems } = useCart();

  return (
    <div className={classNames(s.topBar, s.favouritesTop)}>
      <Link className={s.topBarTitle} to="#">
        Wine Library
      </Link>
      <div className={classNames(s.nav, s.menuNav)}>
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
        <Search onSearchClick={onSearchClick} setIsSearch={setIsSearch} isSearch={isSearch} query={query} setQuery={setQuery} />
        <NavLink to="/favourites" className={getLink(s)}>
          <span className={classNames(s.navFav, s.navButton)}>
            <img src={favourites} aria-label="Favourites" className={s.navFavImg} alt="Favourites" />
              {favouritesItems.length === 0 ? '' : <div className={classNames(s.navCount, s.navCountFav)}>
              <span className={s.navCountNumber}>{favouritesItems.length}</span>
            </div>}
          </span>
        </NavLink>
        <NavLink to="/profile" className={getLink(s)}>
          <span className={classNames(s.navProfile, s.navButton)}>
            <img src={profile} aria-label="Favourites" className={s.navProfileImg} alt="Favourites" />
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
    </div>
  );
};
