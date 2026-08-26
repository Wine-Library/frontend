import { NavLink, useNavigate } from 'react-router-dom';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import s from './Orders.module.scss';
import clsx from 'clsx';
import { useAuth } from '@/context';
import { getProfile } from '@/utils';

import chevronDown from '../../assets/icons/chevron-down.svg';
import truck from '../../assets/icons/truck.svg';
import { CheckoutCard } from '../CheckoutCard/CheckoutCard';
import { useCart } from '@/context/CartContext';
import userImage from '../../assets/useImg.png';

export const Orders = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className={s.orders}>
      <div className={s.headerWrap}>
        <Header />
      </div>
      <div className={s.ordersContent}>
        <div className={s.ordersCard}>
          <div className={s.ordersCardTop}>
            <div className={s.ordersImageWrap}>
              <img src={userImage} alt="" className={s.ordersImage} />
            </div>
            <div className={s.ordersCardText}>
              <h2 className={s.ordersCardName}>{user?.name} {user?.surname}</h2>
              <p className={s.ordersCardMemberSince}>Member since 2023</p>
            </div>
          </div>
          <nav className={s.ordersNav}>
            <ul className={s.ordersNavList}>
              <NavLink to="/profile" end className={getProfile(s)}>Profile</NavLink>
              <NavLink to="/favourites" className={getProfile(s)}>Favourites</NavLink>
              <NavLink to="/orders" className={getProfile(s)}>Orders</NavLink>
              <NavLink to="/basket" className={getProfile(s)}>Cart</NavLink>
              <button onClick={logout} className={clsx(s.ordersSignout)}>Sign Out</button>
            </ul>
          </nav>
        </div>
        <div className={s.orderHistory}>
          <div className={s.orderHistoryTop}>
            <h1 className={s.orderHistoryTitle}>Order History</h1>
            <div className={s.orderHistoryFilters}>
              <button className={s.orderHistoryFilter}>
                Past 6 months
                <img src={chevronDown} alt="" className="" />
              </button>
              <button className={s.orderHistoryFilter}>
                All Orders
                <img src={chevronDown} alt="" className="" />
              </button>
            </div>
          </div>
          <div className={s.order}>
            <div className={s.orderTop}>
              <ul className={s.orderDetails}>
                <li className={s.orderDetailWrap}>
                  <span className={s.orderDetailTitle}>Order Number</span>
                  <span className={s.orderDetailSub}>#WL-2024-0847</span>
                </li>
                <li className={s.orderDetailWrap}>
                  <span className={s.orderDetailTitle}>Date Placed</span>
                  <span className={s.orderDetailSub}>January 14, 2024</span>
                </li>
                <li className={s.orderDetailWrap}>
                  <span className={s.orderDetailTitle}>Total Cost</span>
                  <span className={s.orderDetailSub}>$130.20</span>
                </li>
              </ul>
              <div className={s.orderStatus}>
                <span className={s.orderStatusSpan}>
                  Delivered
                </span>
              </div>
            </div>
            <div className={s.orderLine}></div>
            <ul className={s.orderList}>
              {cartItems.map(item => {
                return (
                  <CheckoutCard key={item.cartItemId ?? item.wine.id} item={item} />
                )
              })}
            </ul>
            <div className={s.orderLine}></div>
            <div className={s.orderBottom}>
              <div className={s.orderTrack}>
                <img src={truck} alt="" className="" />
                <span className={s.orderTrackSpan}>
                  Track package:{' '}
                  <span className={s.orderTrackNumber}>#1Z99AA990123456784</span>
                </span>
              </div>
              <button type="button" onClick={() => navigate('/basket')} className={s.orderReorder}>Reorder Items</button>
            </div>
          </div>
        </div>
      </div>
      <div className={s.orderFooter}>
        <Footer />
      </div>
    </div>
  );
}