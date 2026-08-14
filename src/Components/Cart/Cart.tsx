/* eslint-disable max-len */
import { useState } from 'react';
import { Header } from '../Header/Header';
import ArrowGray from '../../assets/icons/Chevron (Arrow Right) grey.png';
import Home from '../../assets/icons/Home.svg';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import s from './Cart.module.scss';
import Delete from '../../assets/icons/Close.svg';
import Minus from '../../assets/icons/Minus.svg';
import Plus from '../../assets/icons/Plus.svg';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export const Cart = () => {
  const [checkOut, setCheckOut] = useState(false);

  const { clearItemsCart, cartItems, removeItemCart, changeQuantity } = useCart();
  const { showToast } = useToast();

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
      <div className={s.cartHeader}>
        <Header />
      </div>
      <div className={s.cartContent}>
        <div className={s.cartPath}>
          <Link to="/">
            <img src={Home} alt="" />
          </Link>
          <img src={ArrowGray} alt="" />
          <span className={s.cartPathName}>Cart</span>
        </div>
        <h1 className={s.cartTitleCart}>Cart</h1>
        <div className={s.cartSub}>{cartItems.length} items</div>
        <div className={s.cartContainer}>
          <div className={s.cartItems}>
            {cartItems.length === 0 && !checkOut && (
              <span className={s.cartItemsEmpty}>Your cart is empty</span>
            )}
            <div className={s.cartGrid}>
              {cartItems.map(item => {
                const { name, price, imageUrl, id } = item.wine;

                return (
                  <div key={id} className={s.cartItem}>
                    <div className={s.cartLeft}>
                      <button
                        type="button"
                        className={s.cartDelete}
                        onClick={() => {
                          removeItemCart(id);
                        }}
                      >
                        <img className={s.cartDeleteIcon} src={Delete} alt="" />
                      </button>
                      <div className={s.cartImg}>
                        <img
                          className={s.cartImage}
                          src={imageUrl}
                          alt=""
                        />
                      </div>
                      <p className={s.cartTitle}>{name}</p>
                    </div>
                    <div className={s.cartRight}>
                      <div className={s.cartQuantity}>
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              changeQuantity(id, item.quantity - 1);
                            }
                          }}
                          disabled={item.quantity < 2}
                          className={clsx(s.cartQuantityButton, item.quantity < 2 && s.cartQuantityButtonDisabled)}
                        >
                          <img src={Minus} alt="" className={s.cartQuantityButtonIcon}/>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => {
                            changeQuantity(id, item.quantity + 1);
                          }}
                          className={s.cartQuantityButton}
                        >
                          <img src={Plus} alt="" className={s.cartQuantityButtonIcon} />
                        </button>
                      </div>
                      <span className={s.cartPrice}>
                       ${(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div
            className={clsx(s.cartTotal, cartItems.length < 1 && s.cartTotalNone)}
          >
            <span>${totalPrice.toFixed(2)}</span>
            <span className={s.cartTotalSubtotal}>
              Total for {totalQuantity} items
            </span>
            <div className={s.cartLine}></div>
            <button
              onClick={async () => {
                try {
                  await clearItemsCart();
                  setCheckOut(true);
                } catch (err) {
                  console.error("Checkout failed:", err);
                  showToast("Checkout failed. Please try again.");
                }
              }}
              className={s.cartCheckout}
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
          {checkOut && (
            <div className={s.cartCheck}>
              <div className={s.cartCheckContainer}>
                <h1 className={s.cartCheckTitle}>
                  Thank you for your purchase!
                </h1>
                <div className={s.cartLine}></div>
                <button
                  onClick={() => setCheckOut(false)}
                  className={s.cartCheckClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={s.cartFooter}>
      </div>
    </div>
  );
};
