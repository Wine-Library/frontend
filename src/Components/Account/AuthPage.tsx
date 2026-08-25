import { useEffect, useRef, useState } from 'react';
import s from './AuthPage.module.scss';

import close from '../../assets/icons/Close.svg';
import clsx from 'clsx';
import { useAuth } from '@/context';
import LoginForm from '../LoginForm/LoginForm';
import SignupForm from '../SignupForm/SignupForm';

type Props = {
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthPage: React.FC<Props> = ({ setShowAuthModal }) => {
  const mode: "login" | "signup" = "login";

  const { logout, user } = useAuth();

  const [isClosing, setIsClosing] = useState(false);

  const cancelCloseRef = useRef<(() => void) | null>(null);

  function closeModal() {
    cancelCloseRef.current?.();

    setIsClosing(true);
    const timeoutId = setTimeout(() => {
      setShowAuthModal(false);
      setIsClosing(false);
      cancelCloseRef.current = null;
    }, 1000);

    cancelCloseRef.current = () => {
      clearTimeout(timeoutId);
    };
  }

  useEffect(() => {
    return () => {
      cancelCloseRef.current?.();
    };
  }, []);

  return (
    <div className={clsx(s.auth, isClosing && s.authClosing)}>
      <button onClick={closeModal} className={s.authClose}>
        <img src={close} alt="" className={s.authCloseImage} />
      </button>
      {!user ? (
        <>
          {mode === "login" ? <LoginForm /> : <SignupForm />}
        </>
      ) : (
        <div className={s.authWelcome}>
          <h2 className={s.authMessage} >Welcome, {user.email}</h2>
          <button onClick={logout} className={clsx(s.authButton, s.authWelcomeButton)}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default AuthPage;