import s from './OrderCard.module.scss';
import type { OrderItemWithWine } from '@/types/Orders';

type Props = {
  item: OrderItemWithWine;
}

export const OrderCard: React.FC<Props> = ({ item }) => {
  const { wine, quantity, price } = item;

  return (
    <li className={s.orderCard}>
      <div className={s.orderCardImageWrap}>
        {wine?.productImage && (
          <img src={wine.productImage} alt={wine.wineName} className={s.orderCardImage} />
        )}
      </div>
      <div className={s.orderCardText}>
        <h3 className={s.orderCardName}>{wine?.wineName ?? 'Wine'}</h3>
        <span className={s.orderCardDesc}>
          {wine?.wineType ? `${wine.wineType} Wine • ` : ''}Qty {quantity}
        </span>
      </div>
      <span className={s.orderCardPrice}>${(price * quantity).toFixed(2)}</span>
    </li>
  );
};
