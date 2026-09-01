import truck from '../../assets/icons/truck.svg';
import s from '../Orders/Orders.module.scss';
import { useNavigate } from 'react-router-dom';
import type { OrderWithWines } from '@/types/Orders';
import { OrderCard } from '../OrderCard/OrderCard';
import clsx from 'clsx';

type Props = {
  order: OrderWithWines;
}

export const Order: React.FC<Props> = ({ order }) => {
  const navigate = useNavigate();

  const datePlaced = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={s.order}>
      <div className={s.orderTop}>
        <ul className={s.orderDetails}>
          <li className={s.orderDetailWrap}>
            <span className={s.orderDetailTitle}>Order Number</span>
            <span className={s.orderDetailSub}>#{order.id}</span>
          </li>
          <li className={clsx(s.orderDetailWrap, s.orderDetailWrapDisplay)}>
            <span className={s.orderDetailTitle}>Date Placed</span>
            <span className={s.orderDetailSub}>{datePlaced}</span>
          </li>
          <li className={clsx(s.orderDetailWrap, s.orderDetailWrapDisplay)}>
            <span className={s.orderDetailTitle}>Total Cost</span>
            <span className={s.orderDetailSub}>${order.total.toFixed(2)}</span>
          </li>
        </ul>
        <div className={s.orderStatus}>
          <span className={s.orderStatusSpan}>{order.status}</span>
        </div>
      </div>
      <div className={s.orderLine}></div>
      <ul className={s.orderList}>
        {order.orderItems.map((item) => (
          <OrderCard key={item.id} item={item} />
        ))}
      </ul>
      <div className={s.orderLine}></div>
      <div className={s.orderBottom}>
        <div className={s.orderTrack}>
          <img src={truck} alt="" />
          <span className={s.orderTrackSpan}>
            Track package: <span className={s.orderTrackNumber}>#1Z99AA990123456784</span>
          </span>
        </div>
        <button type="button" onClick={() => navigate('/basket')} className={s.orderReorder}>
          Reorder Items
        </button>
      </div>
    </div>
  );
};