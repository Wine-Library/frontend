import s from './Checkout.module.scss';
import lock from '../../assets/icons/lock.svg';
import lockGray from '../../assets/icons/lockGray.svg';
import { Link } from 'react-router-dom';
import shipping from '../../assets/icons/shipping.svg';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import clsx from 'clsx';
import card from '../../assets/icons/card.svg';
import check from '../../assets/icons/check-white.svg';
import { useCart } from '@/context/CartContext';
import { CheckoutCard } from '../CheckoutCard/CheckoutCard';

export const Checkout = () => {
  const { user } = useAuth();

  const { cartItems } = useCart();

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [postCode, setPostCode] = useState(user?.postCode ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [street, setStreet] = useState(user?.street ?? "");
  const [checked, setChecked] = useState(false);
  const [cardName, setCardName] = useState(user?.name ?? "");
  const [cardSurname, setCardSurname] = useState(user?.surname ?? "");
  const [cardNum, setCardNum] = useState("");
  const [date, setDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isCompleteCard, setIsCompleteCard] = useState(false);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.wine.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setSurname(user.surname ?? "");
    setPhoneNumber(user.phoneNumber ?? "");
    setCity(user.city ?? "");
    setStreet(user.street ?? "");
    setPostCode(user.postCode ?? "");
  }, [user]);

  useEffect(() => {
    const complete = Boolean(name && surname && city && phoneNumber && postCode && street);
    setIsComplete(complete);
  }, [name, surname, city, phoneNumber, postCode, street]);

  useEffect(() => {
    const complete = Boolean(cardName && cardSurname && cardNum && cvv && date);
    setIsCompleteCard(complete);
  }, [cardName, cardSurname, cardNum, cvv, date]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
  }

  return (
    <div className={s.checkout}>
      <header className={s.checkoutHeader}>
        <Link to="/" className={s.checkoutHeaderLogo}>
          Wine Library
        </Link>
        <ul className={s.checkoutHeaderStates}>
          <li className={s.checkoutHeaderState}>
            <div className={clsx(s.checkoutHeaderStateNumber, isComplete && s.checkoutHeaderStateNumberDone)}>
              {isComplete ? <img src={check} /> : "1"}
            </div>
            <span className={clsx(s.checkoutHeaderStateName, isComplete && s.checkoutHeaderStateNameDone)}>
              Shipping
            </span>
          </li>
          <div className={s.checkoutLine}></div>
          <li className={s.checkoutHeaderState}>
            <div className={clsx(s.checkoutHeaderStateNumber, isCompleteCard && s.checkoutHeaderStateNumberDone)}>
              {isCompleteCard ? <img src={check} /> : "1"}
            </div>
            <span className={clsx(s.checkoutHeaderStateName, isCompleteCard && s.checkoutHeaderStateNameDone)}>
              Payment
            </span>
          </li>
          <div className={s.checkoutLine}></div>
          <li className={s.checkoutHeaderState}>
            <div className={s.checkoutHeaderStateNumber}>3</div>
            <span className={s.checkoutHeaderStateName}>
              Review
            </span>
          </li>
        </ul>
        <div className={s.checkoutHeaderSecure}>
          <img src={lock} alt="" className="" />
          <span className={s.checkoutHeaderSecureSpan}>
            Secure Checkout
          </span>
        </div>
      </header>
      <div className={s.checkoutContent}>
        <div className={s.checkoutForms}>
          <div className={s.checkoutFormWrap}>
            <div className={s.checkoutFormTitleWrap}>
              <div className={s.checkoutFormImageWrap}>
                <img src={shipping} alt="" className="" />
              </div>
              <h2 className={s.checkoutFormTitle}>
                Shipping Address
              </h2>
            </div>
            <form onSubmit={handleSubmit} className={s.checkoutForm}>
              <div className={s.checkoutFullName}>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>Full Name</h3>
                  <input
                    type="text"
                    className={s.checkoutInput}
                    placeholder="First name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>Surname</h3>
                  <input
                    type="text"
                    className={s.checkoutInput}
                    placeholder="Last name"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className={s.checkoutInputWrap}>
                <h3 className={s.checkoutTitle}>Street</h3>
                <input
                  type="text"
                  className={s.checkoutInput}
                  placeholder="Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  autoComplete="shipping address-line1"
                />
              </div>
              <div className={s.checkoutCity}>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>City</h3>
                  <input
                    type="text"
                    className={s.checkoutInput}
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>
                <div className={clsx(s.checkoutInputWrap, s.checkoutInputWrapZip)}>
                  <h3 className={s.checkoutTitle}>Post Code</h3>
                  <input
                    type="text"
                    className={clsx(s.checkoutInput)}
                    placeholder="Post Code"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    autoComplete="shipping postal-code"
                  />
                </div>
              </div>
              <div className={s.checkoutInputWrap}>
                <h3 className={s.checkoutTitle}>Phone Number</h3>
                <input
                  type="tel"
                  className={s.checkoutInput}
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </form>
          </div>
          <div className={s.checkoutFormWrap}>
            <div className={s.checkoutTop}>
              <div className={s.checkoutFormTitleWrap}>
                <div className={s.checkoutFormImageWrap}>
                  <img src={card} alt="" className="" />
                </div>
                <h2 className={s.checkoutFormTitle}>
                  Payment Method
                </h2>
              </div>
              <ul className={s.checkoutMethodsList}>
                <li className={s.checkoutItem}>VISA</li>
                <li className={s.checkoutItem}>MC</li>
                <li className={s.checkoutItem}>AMEX</li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className={s.checkoutForm}>
              <div className={s.checkoutFullName}>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>Full Name</h3>
                  <input
                    type="text"
                    className={s.checkoutInput}
                    placeholder="First name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    autoComplete="cc-given-name"
                  />
                </div>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>Surname</h3>
                  <input
                    type="text"
                    className={s.checkoutInput}
                    placeholder="Last name"
                    value={cardSurname}
                    onChange={(e) => setCardSurname(e.target.value)}
                    autoComplete="cc-family-name"
                  />
                </div>
              </div>
              <div className={s.checkoutInputWrap}>
                <h3 className={s.checkoutTitle}>Card Number</h3>
                <input
                  type="text"
                  inputMode="numeric"
                  className={s.checkoutInput}
                  placeholder="Card Number"
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  autoComplete="cc-number"
                />
              </div>
              <div className={s.checkoutCity}>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>Expiration date</h3>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={s.checkoutInput}
                    placeholder="Expiration Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    autoComplete="cc-exp"
                  />
                </div>
                <div className={clsx(s.checkoutInputWrap)}>
                  <h3 className={s.checkoutTitle}>Security Code (CVV)</h3>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={clsx(s.checkoutInput)}
                    placeholder="Security Code (CVV)"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    autoComplete="cc-csc"
                  />
                </div>
              </div>
              <div className={s.checkoutCheckboxWrap}>
                <button onClick={() => setChecked(p => !p)} className={clsx(s.checkoutCheckbox, checked && s.checkoutCheckboxChecked)}>
                  <img src={checked ? check : undefined} alt="" className="" />
                </button>
                <span className={s.checkoutCheckboxSpan}>
                  Billing address is same as shipping address
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className={s.checkoutSummary}>
          <h2 className={s.checkoutSummaryTitle}>Order Summary</h2>
          <ul className={s.checkoutList}>
            {cartItems.map(item => {
              return (
                <CheckoutCard key={item.cartItemId ?? item.wine.id} item={item} />
              )
            })}
          </ul>
          <div className={s.checkoutSummaryLine}></div>
          <ul className={s.checkoutSummaryList}>
            <li className={s.checkoutSummaryItem}>
              <span className={s.checkoutSummaryItemLeft}>Subtotal</span>
              <span className={s.checkoutSummaryItemRight}>${totalPrice.toFixed(2)}</span>
            </li>
            <li className={s.checkoutSummaryItem}>
              <span className={s.checkoutSummaryItemLeft}>Shipping</span>
              <span className={s.checkoutSummaryItemRightFree}>FREE</span>
            </li>
            <li className={s.checkoutSummaryItem}>
              <span className={s.checkoutSummaryItemLeft}>Tax estimate</span>
              <span className={s.checkoutSummaryItemRight}>$0.00</span>
            </li>
          </ul>
          <div className={s.checkoutSummaryLine}></div>
          <div className={s.checkoutSummarySummary}>
            <span className={s.checkoutSummarySummarySpan}>Total due</span>
            <span className={s.checkoutSummarySpanTotal}>${totalPrice.toFixed(2)}</span>
          </div>
          <button className={s.checkoutSummaryCheckout} >Place Order & Pay</button>
          <div className={s.checkoutSummarySecure}>
            <img src={lockGray} />
            <span className={s.checkoutSummarySecureSpan}>
              Payments are securely encrypted and processed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}