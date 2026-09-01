import { NavLink } from 'react-router-dom';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import s from './Orders.module.scss';
import clsx from 'clsx';
import { useAuth } from '@/context';
import { getProfile } from '@/utils';

import userImage from '../../assets/useImg.png';
import grape from '../../assets/icons/grape.svg';
import { Order } from '../Order/Order';
import { Filters, type DateRangeValue, type StatusValue } from './Filters';
import { type OrderWithWines, getOrderHistory } from '@/api/Orders';
import { useState, useEffect, useMemo } from 'react';

export const MONTHS_BY_RANGE: Record<DateRangeValue, number | null> = {
  '3m': 3,
  '6m': 6,
  '1y': 12,
  all: null,
};


export const Orders = () => {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState<StatusValue>('all');
  const [orders, setOrders] = useState<OrderWithWines[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeValue>('6m');
  const filteredOrders = useMemo(() => {
    const months = MONTHS_BY_RANGE[dateRange];
    const cutoff = months === null
      ? null
      : new Date(new Date().setMonth(new Date().getMonth() - months));
  
    return orders.filter((order) => {
      const matchesDate = !cutoff || new Date(order.orderDate) >= cutoff;
      const matchesStatus =
        status === 'all' || order.status.toLowerCase() === status.toLowerCase();
      return matchesDate && matchesStatus;
    });
  }, [orders, dateRange, status]);

  useEffect(() => {
    getOrderHistory()
      .then(setOrders)
      .catch((error) => console.error(error))
  }, []);


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
            <Filters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              status={status}
              onStatusChange={setStatus}
            />
          </div>
          {orders.length === 0 ? (
            <div className={s.ordersNoBlock}>
              <div className={s.ordersNoImageWrap}>
                <img src={grape} alt="" className={s.ordersNoImage} />
              </div>
              <div className={s.ordersNoText}>
                <h3 className={s.ordersNoOrders}>
                  No orders yet
                </h3>
                <p className={s.ordersNoSubtext}>
                  Start exploring our collection and curated botanical allocations!
                </p>
              </div>
              <NavLink className={s.ordersBack} to="/wines">
                Browse Wines
              </NavLink>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={s.ordersNoBlock}>
              <div className={s.ordersNoImageWrap}>
                <img src={grape} alt="" className={s.ordersNoImage} />
              </div>
              <div className={s.ordersNoText}>
                <h3 className={s.ordersNoOrders}>
                  No orders match these filters
                </h3>
                <p className={s.ordersNoSubtext}>
                  Try a wider date range or a different status.
                </p>
              </div>
              <button
                type="button"
                className={s.ordersBack}
                onClick={() => {
                  setDateRange('all');
                  setStatus('all');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
              <div className={s.ordersGrid}>
                {filteredOrders.map((order) => (
                  <Order key={order.id} order={order} />
                ))}
              </div>
          )}
        </div>
      </div>
      <div className={s.orderFooter}>
        <Footer />
      </div>
    </div>
  );
}