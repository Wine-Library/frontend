/* eslint-disable max-len */
import { useState } from 'react';
import { Header } from '../Header/Header';
import cart from '../../assets/icons/cart.svg';
import clsx from 'clsx';
import s from './Cart.module.scss';
import { Footer } from '../Footer/Footer';
import { CartCard } from '../CartCard/CartCard';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import like from '../../assets/icons/like.svg';
import search from '../../assets/icons/search-white.svg';

export const Cart = () => {
  const [checkOut] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.wine.price * item.quantity,
    0
  );

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
          <div className={s.cartSub}>{totalQuantity} items in you bag</div>
        </div>
        <div className={s.cartContainer}>
          <div className={s.cartItems}>
            {cartItems.length === 0 && !checkOut && (
              <div className={s.cartEmpty}>
                <div className={s.cartEmptyImageWrap}>
                  <img src={like} alt="" className="" />
                </div>
                <div className={s.cartEmptyText}>
                  <h2 className={s.cartEmptyTitle}>
                    Your cart is empty
                  </h2>
                  <span className={s.cartEmptySubTitle}>
                    Start exploring our handpicked collections
                    of sustainable and organic wines to
                    save the bottles you love.
                  </span>
                  <button onClick={() => navigate('/wines')} className={s.cartEmptyButton}>
                    Browse Wines
                    <img src={search} alt="" className="" />
                  </button>
                </div>
              </div>
            )}
            <div className={s.cartGrid}>
              {cartItems.map(item => {
                return (
                  <CartCard key={item.cartItemId ?? item.wine.id} item={item} />
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
              <button className={s.cartTotalCheckout} onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
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
