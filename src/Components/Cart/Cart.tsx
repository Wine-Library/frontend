/* eslint-disable max-len */
import { useCallback, useState } from 'react';
import { Header } from '../Header/Header';
import cart from '../../assets/icons/cart.svg';
import clsx from 'clsx';
import s from './Cart.module.scss';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Footer } from '../Footer/Footer';
import { CartCard } from '../cartCard/cartCard';
import { NavLink } from 'react-router-dom';

export const Cart = () => {
  const [checkOut, setCheckOut] = useState(false);

  const { clearItemsCart, cartItems } = useCart();
  const { showToast } = useToast();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.wine.price * item.quantity,
    0
  );

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCheckoutClick = useCallback( async () => {
    try {
      await clearItemsCart();
      setCheckOut(true);
    } catch (err) {
      console.error("Checkout failed:", err);
      showToast("Checkout failed. Please try again.");
    }
  }, [clearItemsCart, showToast])

  return (
    <div className={s.cart}>
      <Header />
      <div className={s.cartContent}>
        <div className={s.cartTop}>
          <div className={s.cartTitleWrap}>
            <div className={s.cartTitleImageWrap}>
              <img src={cart} alt="" className={s.cartTitleImage} />
            </div>
            <h1 className={s.cartTitleCart}>Your Cart</h1>
          </div>
          <div className={s.cartSub}>{cartItems.length} items in you bag</div>
        </div>
        <div className={s.cartContainer}>
          <div className={s.cartItems}>
            {cartItems.length === 0 && !checkOut && (
              <span className={s.cartItemsEmpty}>Your cart is empty</span>
            )}
            <div className={s.cartGrid}>
              {cartItems.map(item => {
                return (
                  <CartCard item={item} />
                )
              })}
            </div>
          </div>
          {cartItems.length !== 0 ? (
            <div
            className={clsx(s.cartTotal, cartItems.length < 1 && s.cartTotalNone)}
          >
            <h2 className={s.cartTotalTitle}>Order Summary</h2>
            <ul className={s.cartTotalList}>
              <li className={s.cartTotalItem}>
                <span className={s.cartTotalItemLeft}>Subtotal</span>
                <span className={s.cartTotalItemRight}>${totalPrice.toFixed(2)}</span>
              </li>
              <li className={s.cartTotalItem}>
                <span className={s.cartTotalItemLeft}>Shipping estimate</span>
                <span className={s.cartTotalItemRight}>Calculated next</span>
              </li>
              <li className={s.cartTotalItem}>
                <span className={s.cartTotalItemLeft}>Tax estimate</span>
                <span className={s.cartTotalItemRight}>$0.00</span>
              </li>
            </ul>
            <div className={s.cartTotalLine}></div>
            <div className={s.cartTotalSummary}>
              <span className={s.cartTotalSummarySpan}>Total</span>
              <span className={s.cartTotalSpanTotal}>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={s.cartTotalButtons}>
              <button className={s.cartTotalCheckout}>Proceed to Checkout</button>
              <NavLink to="/wines" className={s.cartTotalContinue}>Continue Shopping</NavLink>
            </div>
          </div>
          ) : (
              null
          )
      }
        </div>
      </div>
      <Footer />
    </div>
  );
};
