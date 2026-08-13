import { Header } from "../Header/Header"
import s from './Wines.module.scss';
import './Wines.module.scss';
import arrowRight from '../../assets/icons/Chevron (Arrow Right) grey.png';
import home from '../../assets/icons/Home.svg';
import clsx from "clsx";
import { Filters } from "../Filters/Filters";
import { getWines } from "@/api/api";
import { useEffect, useState } from "react";
import type { Wine } from "@/types";
import { Link } from "react-router-dom";

import favourites from '../../assets/icons/Favourites (Heart Like).svg';
import favouritesActive from '../../assets/icons/ActiveFav.svg';
import { useFavourites } from "@/context/FavouritesContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context";
import AuthPage from "../Account/AuthPage";
import type { FilterValue } from "@/types/Filter";
import { getCountriesWines, getSortedWines, getTypesWines } from "@/utils/wines";

export const Wines = () => {
  const { user } = useAuth();
  const [wines, setWines] = useState<Wine[]>([]);
  const {cartItems, addItemCart, removeItemCart} = useCart();
  const {favouritesItems, addItemFavourites, removeItemFavorites} = useFavourites();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState<FilterValue>('Popular');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const countryFiltered = getCountriesWines(wines, selectedCountry);
  const typeFiltered = getTypesWines(countryFiltered, selectedType); // filter type from the already-country-filtered list
  const displayedWines = getSortedWines(typeFiltered, selectedSortBy); // sort what's left

  useEffect(() => {
    getWines()
      .then((data) => setWines(data))
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message)
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={s.wines}>
      <Header />
      <div className={clsx(s.winesContent, 'pageContent')}>
        <div className={s.winesPath}>
          <img src={home} alt="" className={s['winesPathHome']} />
          <img src={arrowRight} alt="" className={s['winesPathArrow']} />
          <span className={s['winesPathSpan']}>Wines</span>
        </div>
        <h1 className={s.winesTitle}>Wines Library</h1>
        <h3 className={s.winesSubtitle}>{wines.length} wines · {favouritesItems.length} favourited</h3>
        <Filters selectedType={selectedType} setSelectedType={setSelectedType} onCountrySelect={setSelectedCountry} selectedCountry={selectedCountry}  selectedSortBy={selectedSortBy} setSelectedSortBy={setSelectedSortBy} />
        {loading && <p className={s.winesStatus}>Loading wines…</p>}
        {error && <p className={s.winesStatus}>{error}</p>}
        <div className={s.winesGrid}>
          {displayedWines.map((wine) => {
            const favourited = favouritesItems.some(item => item.id === wine.id);
            const carted = cartItems.some(item => item.id === wine.id);

            return (
            <Link to={`${wine.id}`} className={s.winesCard} key={wine.id}>
              <img src={wine.imageUrl} alt="wine" className={s.winesImage} />
              <h3 className={s.winesName}>{wine.name}</h3>
              <span className={s.winesPrice}>${wine.price}</span>
              <p className={s.winesCountry}>{wine.originCountry} <img src={wine.flagUrl} alt="" className={s.winesFlag} /></p>
              <p className={s.winesRating}>{wine.popularityRating} ⭐</p>
              <div className={s.winesButtons}>
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
                    className={clsx(s.winesButtonsCart, carted && s.winesButtonsCartActive)}
                    >
                      {carted ? 'Added to cart' : 'Add to cart'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!user) {
                        setShowAuthModal(true);
                        return;
                      }

                      if (favourited) {
                        removeItemFavorites(wine.id).catch(console.error);
                      } else {
                        addItemFavourites(wine.id).catch(console.error);
                      }
                    }}
                    className={clsx(s.winesButtonsFavourites, favourited && s.winesButtonsFavouritesActive)}
                  >
                    <img
                      src={favourited ? favouritesActive : favourites}
                      alt={favourited ? "Remove from favourites" : "Add to favourites"}
                      className={s.winesButtonsFavouritesIcon}
                    />
                  </button>
              </div>
            </Link>
          )})}
        </div>
        {showAuthModal && <AuthPage />}
      </div>
    </div>
  )
}