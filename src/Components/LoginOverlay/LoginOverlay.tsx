import s from './LoginOverlay.module.scss';
import close from '../../assets/icons/close-circle.svg';
import LoginForm from '../LoginForm/LoginForm';
import React from 'react';
import { useAsyncCallback } from '@/utils/hooks';
import { Loader } from '../Loader/Loader';

type Props = {
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginOverlay: React.FC<Props> = ({ setShowAuthModal }) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const { loading } = useAsyncCallback<void>();

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setShowAuthModal(false);
    }
  };

  return (
    <div
      className={`${s.loginOverlayWrap} ${isClosing ? s.closing : ""}`}
      onAnimationEnd={handleAnimationEnd}
      onClick={handleClose}
    >
      {loading && <Loader />}
      <div onClick={(e) => {
        e.stopPropagation();
        }} className={s.loginOverlay}>
          <button
            onClick={handleClose}
            className={s.loginOverlayClose}
          >
            <img src={close} alt="" />
          </button>

          <LoginForm />
        </div>
      </div>
    );
  };