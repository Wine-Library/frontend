import type { Wine } from "@/types";
import { Link } from "react-router-dom";
import s from '../Favourites/Favourites.module.scss';
import { useFavourites } from "@/context/FavouritesContext";
import favourites from '../../assets/icons/Favourites (Heart Like).svg';
import favouritesActive from '../../assets/icons/ActiveFav.svg';
import { useCart } from "@/context/CartContext";
import clsx from "clsx";

type Props = {
  wine: Wine;
}

export const FavouritesCard: React.FC<Props> = ({ wine }) => {
  const { favouritesItems, addItemFavourites, removeItemFavourites } = useFavourites();
  const {cartItems, addItemCart, removeItemCart} = useCart();
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
  )
}