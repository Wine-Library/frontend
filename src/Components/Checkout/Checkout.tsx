import s from './Checkout.module.scss';
import lock from '../../assets/icons/lock.svg';
import lockGray from '../../assets/icons/lockGray.svg';
import { Link, useNavigate } from 'react-router-dom';
import shipping from '../../assets/icons/shipping.svg';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import clsx from 'clsx';
import card from '../../assets/icons/card.svg';
import check from '../../assets/icons/check-white.svg';
import { useCart } from '@/context/CartContext';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, Elements } from "@stripe/react-stripe-js";
import { CheckoutCard } from '../CheckoutCard/CheckoutCard';
import { loadStripe } from '@stripe/stripe-js';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/context/ToastContext';
import { usePayment } from '@/context/PaymentContext';

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      "::placeholder": { color: "#999" },
    },
  },
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  const { user } = useAuth();
  const { cartItems, cartLoading, clearItemsCart } = useCart();
  const { showToast } = useToast();

  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [postCode, setPostCode] = useState(user?.zipCode ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [street, setStreet] = useState(user?.street ?? "");
  const [checked, setChecked] = useState(false);
  const [cardName, setCardName] = useState(user?.name ?? "");
  const [cardSurname, setCardSurname] = useState(user?.surname ?? "");
  const [isComplete, setIsComplete] = useState(false);
  const [isCompleteCard, setIsCompleteCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPaymentIntent } = usePayment();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.wine.price * item.quantity,
    0
  );

  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const { placeOrder } = useOrder();
  const CURRENCY = "usd";

  useEffect(() => {
    // Wait for the cart to finish loading — cartItems starts empty while it
    // fetches, so checking totalPrice before then would bounce people with a
    // real cart. Also skip while a submit is in flight: on a successful order
    // the cart gets cleared right before we navigate to /orders ourselves.
    if (cartLoading || isSubmitting) return;
    if (totalPrice === 0) {
      navigate('/wines');
    }
  }, [cartLoading, isSubmitting, totalPrice, navigate]);

  useEffect(() => {
    const complete = Boolean(
      cardName && cardSurname && cardNumberComplete && cardExpiryComplete && cardCvcComplete
    );
    setIsCompleteCard(complete);
  }, [cardName, cardSurname, cardNumberComplete, cardExpiryComplete, cardCvcComplete]);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setSurname(user.surname ?? "");
    setPhoneNumber(user.phoneNumber ?? "");
    setCity(user.city ?? "");
    setStreet(user.street ?? "");
    setPostCode(user.zipCode ?? "");
  }, [user]);

  useEffect(() => {
    const complete = Boolean(name && surname && city && phoneNumber && postCode && street);
    setIsComplete(complete);
  }, [name, surname, city, phoneNumber, postCode, street]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      showToast("You need to be logged in to place an order");
      return;
    }
    if (totalPrice === 0) {
      navigate('/wines');
      return;
    }
    
    if (!isComplete || !isCompleteCard) {
      showToast("Please fill in all shipping and payment fields first");
      return;
    }
    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { clientSecret } = await createPaymentIntent(Math.round(totalPrice * 100), CURRENCY);
      const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardNumberElement)! },
    });

      if (result.error) {
        showToast(result.error.message ?? "Payment failed");
        return;
      }

      await placeOrder({ street, city, zipCode: postCode });
      showToast("Order placed!", "success");
      clearItemsCart();
      navigate('/orders');
    } catch (err) {
      console.error("Checkout failed:", err);
      showToast("Something went wrong placing your order");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={s.checkout}>
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
              {isCompleteCard ? <img src={check} /> : "2"}
            </div>
            <span className={clsx(s.checkoutHeaderStateName, isCompleteCard && s.checkoutHeaderStateNameDone)}>
              Payment
            </span>
          </li>
          <div className={s.checkoutLine}></div>
          <li className={s.checkoutHeaderState}>
            <div className={clsx(s.checkoutHeaderStateNumber, isComplete && isCompleteCard && s.checkoutHeaderStateNumberCurrent)}>3</div>
            <span className={clsx(s.checkoutHeaderStateName, isComplete && isCompleteCard && s.checkoutHeaderStateNameCurrent)}>
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
            <div className={s.checkoutForm}>
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
            </div>
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
            <div className={s.checkoutForm}>
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
                <CardNumberElement options={cardElementOptions} onChange={(e) => setCardNumberComplete(e.complete)} />
              </div>
              <div className={s.checkoutCredentials}>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>Expiration date</h3>
                  <CardExpiryElement options={cardElementOptions} onChange={(e) => setCardExpiryComplete(e.complete)} />
                </div>
                <div className={s.checkoutInputWrap}>
                  <h3 className={s.checkoutTitle}>Security Code (CVV)</h3>
                  <CardCvcElement options={cardElementOptions} onChange={(e) => setCardCvcComplete(e.complete)} />
                </div>
              </div>
              <div className={s.checkoutCheckboxWrap}>
                <button
                  type="button"
                  onClick={() => setChecked((p) => !p)}
                  className={clsx(s.checkoutCheckbox, checked && s.checkoutCheckboxChecked)}
                >
                  <img src={checked ? check : undefined} alt="" className="" />
                </button>
                <span className={s.checkoutCheckboxSpan}>
                  Billing address is same as shipping address
                </span>
              </div>
            </div>
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
          <button type="submit" disabled={isSubmitting} className={s.checkoutSummaryCheckout}>
            {isSubmitting ? "Placing order…" : "Place Order & Pay"}
          </button>
          <div className={s.checkoutSummarySecure}>
            <img src={lockGray} />
            <span className={s.checkoutSummarySecureSpan}>
              Payments are securely encrypted and processed.
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};