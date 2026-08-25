import { useAuth } from '@/context';
import s from './ProfileDataChange.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useAsyncCallback } from '@/utils/hooks';
import { useToast } from '@/context/ToastContext';
import { getAuthErrorMessage } from '@/utils/errors'; // adjust path to wherever this actually lives
import { Loader } from '../Loader/Loader';
import arrowBrown from '../../assets/icons/arrow-left-brown.svg';
import { NavLink, useNavigate } from 'react-router-dom';

export const ProfileDataChange = () => {
  const { showToast } = useToast();
  const { loading, execute } = useAsyncCallback<void>();

  const { user, changeUserData } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState(user?.password ?? "");
  const [repeatPassword, setRepeatPassword] = useState(user?.password ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [shippingAddress, setShippingAddress] = useState(user?.shippingAddress ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);
  const [show, setShow] = useState(false);
  const [repeatShow, setRepeatShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setSurname(user.surname ?? "");
    setEmail(user.email ?? "");
    setPhoneNumber(user.phoneNumber ?? "");
    setShippingAddress(user.shippingAddress ?? "");
  }, [user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setValidationError(null);

    try {
      await execute(() => changeUserData({ name, password, repeatPassword, surname, email, phoneNumber, shippingAddress }));
      showToast("Profile updated!");
    } catch (err) {
      setValidationError(getAuthErrorMessage(err));
    } finally {
      isSubmittingRef.current = false;
      navigate("/profile");
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className={s.profileDataChangeWrap}>
      <div className={s.profileDataWrap}>
        <div className={s.profileBack}>
          <img src={arrowBrown} alt="" className="" />
          <NavLink className={s.profileBackLink} to="/profile">
            Back to My Account
          </NavLink>
        </div>
        <div className={s.profileDataChange}>
          <div className={s.profileDataChangeText}>
            <h1 className={s.profileDataChangeName}>
              Edit Profile
            </h1>
            <p className={s.profileDataChangeSub}>
              Update your personal details,
              botanical allocations, and taste preferences.
            </p>
          </div>
          <form onSubmit={handleSubmit} className={s.profileDataChangeForm}>
            <div className={s.profileDataChangeFullName}>
              <div className={s.profileDataChangeInputWrap}>
                <h3 className={s.profileDataChangeTitle}>Full Name</h3>
                <input
                  type="text"
                  className={s.profileDataChangeInput}
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>
              <div className={s.profileDataChangeInputWrap}>
                <h3 className={s.profileDataChangeTitle}>Surname</h3>
                <input
                  type="text"
                  className={s.profileDataChangeInput}
                  placeholder="Last name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div className={s.profileDataChangeInputWrap}>
              <h3 className={s.profileDataChangeTitle}>Email Address</h3>
              <input
                type="email"
                className={s.profileDataChangeInput}
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
             <div className={s.profileDataChangeInputWrap}>
              <h3 className={s.profileDataChangeTitle}>Choose Password</h3>
              <input
                type={show ? "password" : "text"}
                className={s.profileDataChangeInput}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="email"
              />
              <button type="button" onClick={() => setShow(p => !p)} className={s.profileDataChangeButtonShow}>
                {show ? "Show" : "Hide"}
              </button>
            </div>
             <div className={s.profileDataChangeInputWrap}>
              <h3 className={s.profileDataChangeTitle}>Confirm Password</h3>
              <input
                type={repeatShow ? "password" : "text"}
                className={s.profileDataChangeInput}
                placeholder="Repeat Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                autoComplete="email"
              />
              <button type="button" onClick={() => setRepeatShow(p => !p)} className={s.profileDataChangeButtonShow}>
                {repeatShow ? "Show" : "Hide"}
              </button>
            </div>
            <div className={s.profileDataChangeInputWrap}>
              <h3 className={s.profileDataChangeTitle}>Phone Number</h3>
              <input
                type="tel"
                className={s.profileDataChangeInput}
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className={s.profileDataChangeInputWrap}>
              <h3 className={s.profileDataChangeTitle}>Shipping Address</h3>
              <input
                type="text"
                className={s.profileDataChangeInput}
                placeholder="Shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                autoComplete="shipping street-address"
              />
            </div>
            {validationError && <p className={s.profileDataChangeError}>{validationError}</p>}
            <div className={s.profileDataChangeButtons}>
              <button type="submit" disabled={loading} className={s.profileDataChangeButton}>
                {loading ? "Saving Changes" : "Save changes"}
              </button>
              <button type="button" onClick={() => navigate("/profile")} className={s.profileDataChangeButtonCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}