import s from './CheckYourEmail.module.scss';

export const CheckYourEmail = () => (
  <div className={s.checkYourEmail}>
    <h2>Check your inbox</h2>
    <p>
      We've sent a confirmation link to your email address.
      Please click the link to activate your account.
    </p>
  </div>
);