import type { CartFavItem } from '@/types';
import s from './CheckoutCard.module.scss';

type Props = {
  item: CartFavItem;
}

export const CheckoutCard: React.FC<Props> = ({ item }) => {
  const { wineName: name, price, productImage: imageUrl, wineType: type } = item.wine;

  return (
    <li className={s.checkoutCard}>
      <div className={s.checkoutCardImageWrap}>
        <img src={imageUrl} alt="" className={s.checkoutCardImage} />
      </div>
      <div className={s.checkoutCardText}>
        <h3 className={s.checkoutCardName}>{name}</h3>
        <span className={s.checkoutCardDesc}>
          {type} Wine • Qty {item.quantity}
        </span>
      </div>
      <span className={s.checkoutCardPrice}>
        ${(price * item.quantity).toFixed(2)}
      </span>
    </li>
  )
}
