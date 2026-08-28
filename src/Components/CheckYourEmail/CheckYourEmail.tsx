import s from './CheckYourEmail.module.scss';
import mail from '../../assets/icons/mail.svg';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context';
import { useToast } from '@/context/ToastContext';
import { useAsyncCallback } from '@/utils/hooks';
import { getAuthErrorMessage } from '@/utils/errors';

type Props = {
  email?: string;
}

export const CheckYourEmail: React.FC<Props> = ({ email: emailProp }) => {
  const location = useLocation();
  const email = location.state?.email ?? emailProp;
  const { resendEmailVerification } = useAuth();
  const { showToast } = useToast();
  const { loading, execute } = useAsyncCallback<void>();

  async function handleResend() {
    if (!email) {
      showToast("We don't know which email to resend to. Please sign up again.");
      return;
    }

    try {
      await execute(() => resendEmailVerification(email));
      showToast('Verification email sent. Please check your inbox.');
    } catch (err) {
      showToast(getAuthErrorMessage(err));
    }
  }

  return (
    <div className={s.checkYourEmail}>
      <div className={s.checkYourEmailImageWrap}>
        <img src={mail} alt="" className={s.checkYourEmailImage} />
      </div>
      <div className={s.checkYourEmailText}>
        <h2 className={s.checkYourEmailTitle} >Check Your Email</h2>
        <div className={s.checkYourEmailInfo}>
          <p className={s.checkYourEmailSubtitle}>
            We have sent an authentication or reset link to:
          </p>
          <div className={s.checkYourEmailMail}>{email}</div>
          <p className={s.checkYourEmailSub}>
            Please tap the confirmation button inside
            that email to successfully sign back in.
          </p>
        </div>
      </div>
      <div className={s.checkYourEmailButtons}>
        <button
          type="button"
          className={s.checkYourEmailResend}
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Resend Email Link'}
        </button>
        <div className={s.checkYourEmailLine}></div>
        <div className={s.checkYourEmailBack}>
          <span className={s.checkYourEmailBackSpan}>Done checking?</span>
          <NavLink to="/login" className={s.checkYourEmailBackNav}>Back to Login</NavLink>
        </div>
      </div>
    </div>
  );}
