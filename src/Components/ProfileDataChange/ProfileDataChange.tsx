import { useAuth } from '@/context';
import s from './ProfileDataChange.module.scss';
import { useRef, useState } from 'react';
import { useAsyncCallback } from '@/utils/hooks';
import { useToast } from '@/context/ToastContext';
import { getAuthErrorMessage } from '@/utils/errors'; // adjust path to wherever this actually lives
import { Loader } from '../Loader/Loader';
import { Header } from '../Header/Header';

export const ProfileDataChange = () => {
  const { changeUserData } = useAuth();
  const { showToast } = useToast();
  const { loading, execute } = useAsyncCallback<void>();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setValidationError(null);

    try {
      await execute(() => changeUserData({ name, surname, phoneNumber, shippingAddress }));
      showToast("Profile updated!");
    } catch (err) {
      setValidationError(getAuthErrorMessage(err));
    } finally {
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className={s.profileDataChange}>
      <Header />
      <form onSubmit={handleSubmit} className={s.profileDataChangeForm}>
        <input
          type="text"
          className={s.profileDataChangeInput}
          placeholder="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          required
        />
        <input
          type="text"
          className={s.profileDataChangeInput}
          placeholder="Last name"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          autoComplete="family-name"
          required
        />
        <input
          type="tel"
          className={s.profileDataChangeInput}
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="tel"
          required
        />
        <input
          type="text"
          className={s.profileDataChangeInput}
          placeholder="Shipping address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          autoComplete="shipping street-address"
          required
        />
        {validationError && <p className={s.profileDataChangeError}>{validationError}</p>}
        <button type="submit" disabled={loading} className={s.profileDataChangeButton}>
          {loading ? <Loader /> : "Save changes"}
        </button>
      </form>
    </div>
  );
}