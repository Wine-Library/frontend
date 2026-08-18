import clsx from 'clsx';
import s from './Profile.module.scss';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import closeSvg from '../../assets/icons/Close.svg';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleNavigate() {
    navigate("/");
  }

  if (!user) {
    return null; // avoid rendering user.email before the redirect effect fires
  }

  return (
    <div className={clsx(s.profile)}>
      <Header />
      <div className={s.profileContent}>
        <button onClick={handleNavigate} className={s.profileClose}>
          <img src={closeSvg} alt="" className={s.profileIcon} />
        </button>
        <div className={s.profileText}>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <p>Your phone number: {user.phoneNumber}</p>
          <p>Your shipping adress: {user.shippingAddress}</p>
          <button className={s.profileButton} onClick={handleLogout}>Sign Out</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;