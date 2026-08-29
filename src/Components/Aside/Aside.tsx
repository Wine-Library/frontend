import { Link, NavLink, useNavigate } from "react-router-dom";
import s from './Aside.module.scss';
import classNames from "classnames";
import { useCart } from "@/context/CartContext";
import basket from '../../assets/icons/shopping-bag.svg';
import close from '../../assets/icons/close-circle.svg';
import menu from '../../assets/icons/menu.svg';
import arrow from '../../assets/icons/arrow-right-aside.svg';
import arrowActive from '../../assets/icons/arrow-right-aside-active.svg';
import { useState } from "react";
import { getNavAside } from "@/utils";
import clsx from "clsx";
import { useAuth } from "@/context";

export const Aside = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setClosing(true);

  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <aside className={s.aside}>
      <Link className={s.asideTitle} to="#">
        Wine Library
      </Link>
      <div className={s.asideVectors}>
        <button onClick={() => setOpen(true)} className={s.asideMenu}>
          <img src={menu} aria-label="Menu" className={s.asideMenuImage} alt="basket" />
        </button>
        <NavLink to="/basket" className="">
          <span className={classNames(s.asideBasket, s.asideButton)}>
            <img src={basket} aria-label="Basket" className={s.asideBasketImg} alt="basket" />
            {cartItems.length === 0 ? '' : <div className={s.asideCount}>
              <span className={s.asideCountNumber}>{cartItems.length}</span>
            </div>}
          </span>
        </NavLink>
      </div>
      {open && (
        <div
          className={clsx(s.asideContent, closing ? s.asideContentClose : s.asideContentOpen)}
          onAnimationEnd={() => {
            if (closing) {
              setOpen(false);
              setClosing(false);
            }
          }}
        >
          <div className={s.asideTop}>
            <Link className={s.asideTitle} to="#">
              Wine Library
            </Link>
            <button onClick={handleClose} className={s.asideClose}>
              <img src={close} alt={close} className={s.asideCloseImage} />
            </button>
          </div>
          <div className={s.asideBottom}>
            <nav className={s.asideNav}>
              <NavLink
                to="/"
                className={getNavAside(s)}
              >
                {({ isActive }) => (
                  <>
                    Home
                    <img
                      src={isActive ? arrowActive : arrow}
                      alt=""
                    />
                  </>
                )}
              </NavLink>
              <NavLink
                to="/Wines"
                className={getNavAside(s)}
              >
                {({ isActive }) => (
                  <>
                    Wines
                    <img
                      src={isActive ? arrowActive : arrow}
                      alt=""
                    />
                  </>
                )}
              </NavLink>
              <NavLink
                to="/Profile"
                className={getNavAside(s)}
              >
                {({ isActive }) => (
                  <>
                    Profile
                    <img
                      src={isActive ? arrowActive : arrow}
                      alt=""
                    />
                  </>
                )}
              </NavLink>
              <NavLink
                to="/Favourites"
                className={getNavAside(s)}
              >
                {({ isActive }) => (
                  <>
                    Favourites
                    <img
                      src={isActive ? arrowActive : arrow}
                      alt=""
                    />
                  </>
                )}
              </NavLink>
              <NavLink
                to="/basket"
                className={getNavAside(s)}
              >
                {({ isActive }) => (
                  <>
                    Cart
                    <img
                      src={isActive ? arrowActive : arrow}
                      alt=""
                    />
                  </>
                )}
              </NavLink>
              <NavLink
                to="/Orders"
                className={getNavAside(s)}
              >
                {({ isActive }) => (
                  <>
                    Orders
                    <img
                      src={isActive ? arrowActive : arrow}
                      alt=""
                    />
                  </>
                )}
              </NavLink>
            </nav>
            <div className={s.asideBackImage}></div>
            {!user ? (<div className={s.asideButtons}>
              <button onClick={() => navigate("/login")} className={s.asideSignin}>Sign In</button>
              <div className={s.asideSignup}>
                <span className={s.asideSignupSpan}>
                  New here?
                </span>
                <NavLink className={s.asideSignupNav} to={"/signup"}>Create Account</NavLink>
              </div>
            </div>) : (
                <button onClick={logout} className={s.asideLogout}>Sign Out</button>
            ) }
          </div>
        </div>
      )}
    </aside>
  );
}