import type { CartFavItem } from "@/types";
import s from '../Cart/Cart.module.scss';
import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  item: CartFavItem;
}

export const CartCard: React.FC<Props> = ({ item }) => {
  const { wineName: name, price, productImage: imageUrl, year: year, id, wineType: type, countryOfOrigin: country } = item.wine;
  const { removeItemCart, changeQuantity } = useCart();
  const quantity = item.quantity;
  const updateQuantity = (next: number) => {
    const clamped = Math.max(1, next);
    changeQuantity(id!, clamped);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDeleteClick(e: React.MouseEvent, wineId: string) {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(wineId);
  }

  function handleAnimationEnd(e: React.AnimationEvent, wineId: string) {
    if (e.target !== e.currentTarget) return;
    if (wineId === deletingId) {
      removeItemCart(wineId);
      setDeletingId(null);
    }
  }

  return (
    <Link
      to={`/wines/${id}`}
      key={id}
      onAnimationEnd={(e) => handleAnimationEnd(e, id)}
      className={clsx(s.cartItem, deletingId === id && s.cartItemDeleting)}
    >
      <div className={s.cartItemImageWrap}>
        <img src={imageUrl} className={s.cartItemImage} />
      </div>
      <div className={s.cartItemText}>
        <h3 className={s.cartItemTitle}>{name}</h3>
        <span className={s.cartItemDesc}>{type} Wine • {country} • {year}</span>
        <span className={s.cartItemPrice}>${price.toFixed(2)} / bottle</span>
      </div>
      <div className={s.cartItemRight}>
        <div onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }} className={s.cartItemQuantityStepper}>
          <div className={clsx(s.cartItemQuantityStep, s.cartItemQuantityStepMinus)}>
            <button
              type="button"
              className={s.cartItemQuantityStepSpan}
              onClick={(e) => {
                updateQuantity(quantity - 1);
                e.preventDefault();
                e.stopPropagation();
              }}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
          </div>
          <span className={s.cartItemQuantityNumber}>{quantity}</span>
          <div className={clsx(s.cartItemQuantityStep, s.cartItemQuantityStepPlus)}>
            <button
              type="button"
              className={s.cartItemQuantityStepSpan}
              onClick={(e) => {
                updateQuantity(quantity + 1);
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <div className={s.cartItemTotal}>
          <span className={s.cartItemTotalSpan}>Total</span>
          <span className={s.cartItemTotalPrice}>${(price * quantity).toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={(e) => handleDeleteClick(e, id)}
          className={s.cartItemDelete}
        >
          X
        </button>
      </div>
    </Link>
  );
}