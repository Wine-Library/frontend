import { useState, type FormEvent } from 'react';
import s from './ResetPassword.module.scss';
import { resetPassword } from '@/api/auth';
import { useToast } from '@/context/ToastContext';
import type { AuthResponse, ResetPasswordFormValues } from '@/types';
import { useAsyncCallback } from '@/utils/hooks';
import { getPasswordError } from '@/utils/utlis';
import { getErrorMessage } from '@/utils/errors';
import { useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import { Loader } from '../Loader/Loader';
import ArrowLeft from '../../assets/icons/arrow-left-brown.svg';
import SignupImg from '../../assets/SignUpImage.png';
import { ChoosePasswordField } from '../ChoosePass/ChoosePass';

export const ResetPassword = () => {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { execute, loading } = useAsyncCallback<AuthResponse>();
  const [visible, setVisible] = useState(false);

  const [form, setForm] = useState<ResetPasswordFormValues>({
    newPassword: "",
    repeatPassword: "",
  });

  if (!token) {
    return (
      <div className={s.resetPasswordPage}>
        <p className={s.resetPasswordPageError}>
          This link looks incomplete. Please use the link from your password reset email.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    const passwordError = getPasswordError(form.newPassword);
    if (passwordError) {
      showToast(passwordError);
      return;
    }

    if (form.newPassword !== form.repeatPassword) {
      showToast("Passwords do not match.");
      return;
    }

    try {
      await execute(() => resetPassword({ token, newPassword: form.newPassword, repeatPassword: form.repeatPassword }));
      showToast("Password reset! You can now log in.", "success");
      navigate("/");
    } catch (err) {
      showToast(
        getErrorMessage(err, {
          400: "This link is invalid or has expired.",
          404: "This link is invalid or has expired.",
          410: "This link is invalid or has expired.",
        })
      );
    }
  }

  // async function handleSubmitResend(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   if (!token) return; 

  //   setValidationError(null);

  //   const passwordError = getPasswordError(form.newPassword);
  //   if (passwordError) {
  //     setValidationError(passwordError);
  //     return;
  //   }
    
  //   if (form.newPassword !== form.repeatPassword) {
  //     setValidationError("Passwords do not match.");
  //     return;
  //   }

  //   try {
  //     await execute(() => resetPassword({ token, newPassword: form.newPassword, repeatPassword: form.repeatPassword }));
  //     showToast("Password reset! You can now log in.");
  //     navigate("/");
  //   } catch {
  //     // error state handled below via useAsyncCallback
  //   }
  // }

  return (
    <div className={s.resetPassword}>
      {loading && <Loader />}
      <header className={s.resetPasswordHeader}>
        <NavLink className={s.resetPasswordLogoLink} to="/">
          <h1 className={s.resetPasswordLogo}>Wine Library</h1>
        </NavLink>
        <NavLink to="/Wines" className={s.resetPasswordBack}>
          <img src={ArrowLeft} alt="" className={s.resetPasswordBackIcon} />
          <span className={s.resetPasswordBackSpan}>
            Back to Catalog
          </span>
        </NavLink>
      </header>
      <div className={s.resetPasswordBottom}>
        <div className={s.resetPasswordBottomLeft}>
          <div className={s.resetPasswordQuoteWrap}>
            <p className={s.resetPasswordQuote}>
              “The vine is the earth's translator.”
            </p>
            <p className={s.resetPasswordSubQuote}>
              Access rare biodynamic vintages
              and small-estate allocations
              directly from our temperature-controlled cellar.
            </p>
          </div>
          <img src={SignupImg} alt="" className={s.resetPasswordImage} />
        </div>
        <div className={s.resetPasswordBottomRight}>
          <div className={s.resetPasswordText}>
            <h1 className={s.resetPasswordTitle}>
              Create New Password
            </h1>
            <p className={s.resetPasswordSubtitle}>
              Please choose a secure and memorable password
              for your collector account.
            </p>
          </div>
          <form onSubmit={handleSubmit} className={s.resetPasswordForm}>
            <ChoosePasswordField value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
            <div className={s.resetPasswordInputWrap}>
              <span className={s.resetPasswordInputSpan}>
                Confirm New Password
              </span>
              <input
                type={visible ? "text" : "password"}
                placeholder="Repeat new password"
                className={s.resetPasswordInput}
                value={form.repeatPassword}
                onChange={(e) => setForm({ ...form, repeatPassword: e.target.value })}
                required
              />
              <button type="button" onClick={() => setVisible((v) => !v)} className={s.resetPasswordButtonShow}>
                {visible ? "HIDE" : "SHOW"}
              </button>
            </div>
            <button type="submit" disabled={loading} className={s.resetPasswordButton}>
              {loading ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}