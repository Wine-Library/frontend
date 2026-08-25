import s from './CheckYourEmail.module.scss';
import mail from '../../assets/icons/mail.svg';
import { NavLink, useLocation } from 'react-router-dom';

type Props = {
  email: string;
}

export const CheckYourEmail: React.FC<Props> = () => {
  const location = useLocation();
  const email = location.state?.email;

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
        <button type="submit" className={s.checkYourEmailResend}>Resend Email Link</button>
        <div className={s.checkYourEmailLine}></div>
        <div className={s.checkYourEmailBack}>
          <span className={s.checkYourEmailBackSpan}>Done checking?</span>
          <NavLink to="/login" className={s.checkYourEmailBackNav}>Back to Login</NavLink>
        </div>
      </div>
    </div>
  );}