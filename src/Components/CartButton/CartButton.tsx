import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import React from "react";
import s from "../Wines/Wines.module.scss";
import type { Wine } from "@/types";

type Props = {
  wine: Wine;
}

export const CartButton: React.FC<Props> = React.memo(({ wine }) => {
  const { cartItems, addItemCart, removeItemCart } = useCart();

  const carted = cartItems.some((item) => item.wine.id === wine.id);

  const toggleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    return carted ? removeItemCart(wine.id) : addItemCart(wine);
  }

  return (
    <button
      onClick={toggleCart}
      type="button"
      className={clsx(s.winesButtonsCart, carted && s.winesButtonsCartActive)}
    >
      {carted ? "Added to cart" : "Add to cart"}
    </button>
  );
 }
)