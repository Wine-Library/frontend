import s from './Toast.module.scss';
import warning from '../../assets/icons/error.svg'; 
import success from '../../assets/icons/success.svg'; 
import close from '../../assets/icons/close-circle.svg';
import clsx from 'clsx';

export type ToastType = 'success' | 'error';

type Props = {
  message: string | null;
  isClosing: boolean;
  type?: ToastType;
  onClosed: () => void;
}

export const Toast: React.FC<Props> = ({ message, isClosing, type = 'error', onClosed }) => {
  const isSuccess = type === 'success';

  return (
    <div
      className={clsx(s.toast, isClosing && s.toastClosing)}
      onAnimationEnd={() => { if (isClosing) onClosed?.(); }}
    >
      <div className={clsx(s.toastImageWarning, isSuccess && s.toastImageSuccess)}>
        <img src={isSuccess ? success : warning} alt="" className="" />
      </div>
      <div className={s.toastText}>
        <h2 className={s.toastTitle}>{message}</h2>
      </div>
      <button onClick={onClosed} className={s.toastButtonClose}>
        <img src={close} />
      </button>
    </div>
  )
}