import clsx from 'clsx';
import s from './Profile.module.scss';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import closeSvg from '../../assets/icons/Close.svg';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';

const Profile = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleNavigate() {
    navigate("/");
  }

  return (
    <div className={clsx(s.profile)}>
      <Header />
      <div className={s.profileContent}>
        <button onClick={handleNavigate} className={s.profileClose}>
          <img src={closeSvg} alt="" className={s.profileIcon} />
      </button>
        {!user ? (
          <>
            {mode === "login" ? <Login /> : <Signup />}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className={s.profileButton}
            >
              {mode === "login" ? "Need an account? Signup" : "Already have an account? Login"}
            </button>
          </>
        ) : (
          <div className={s.profileText}>
            <p>Welcome, {user.email}</p>
            <button className={s.profileButton} onClick={handleLogout}>Sign Out</button>
          </div>
        )}
      </div>
      <Footer />
<<<<<<< HEAD
=======
      <div className={s.profileFooter}>
        <Footer />
      </div>
      <div className={s.profileFooter}>
        <Footer />
      </div>
>>>>>>> 5281f8d13bfab7c48a363a1ffe1ece1a7b60eca0
    </div>
  );
}

export default Profile;