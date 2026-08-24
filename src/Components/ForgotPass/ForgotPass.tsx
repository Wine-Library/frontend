import { type SubmitEvent, useState } from "react";
import s from "./ForgotPass.module.scss";
import { useAsyncCallback } from "@/utils/hooks";
import { Loader } from "../Loader/Loader";
import { useToast } from "@/context/ToastContext";
import { forgotPasswordApi } from "@/api/auth";
import { NavLink } from "react-router-dom";
import SigninImg from '../../assets/SignInImage.png';
import mail from '../../assets/icons/mail-green.svg';
import ArrowLeft from '../../assets/icons/arrow-left-brown.svg';

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { execute, loading, error } = useAsyncCallback<void>();
  const { showToast } = useToast();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await execute(() => forgotPasswordApi(email));
      setSubmitted(true);
      showToast("Check your email for a reset link.");
    } catch {
      // error rendered below
    }
  }

  if (submitted) {
    return (
      <div className={s.forgotPassword}>
        <header className={s.forgotPasswordHeader}>
          <NavLink className={s.forgotPasswordLink} to="/">
            <h1 className={s.forgotPasswordLogo}>Wine Library</h1>
          </NavLink>
          <NavLink to="/Wines" className={s.forgotPasswordBack}>
            <img src={ArrowLeft} alt="" className={s.forgotPasswordBackIcon} />
            <span className={s.forgotPasswordBackSpan}>
              Back to Catalog
            </span>
          </NavLink>
        </header>
        <div className={s.forgotPasswordBottom}>
        <div className={s.forgotPasswordBottomLeft}>
          <div className={s.forgotPasswordQuoteWrap}>
            <p className={s.forgotPasswordQuote}>
              “The vine is the earth's translator.”
            </p>
            <p className={s.forgotPasswordSubQuote}>
              Access rare biodynamic vintages
              and small-estate allocations
              directly from our temperature-controlled cellar.
            </p>
          </div>
          <img src={SigninImg} alt="" className={s.forgotPasswordImage} />
          </div>
          <div className={s.forgotPasswordBottomRight}>
            <div className={s.forgotPasswordRight}>
              <div className={s.forgotPasswordMailWrap}>
                <img src={mail} alt="" className="" />
              </div>
              <div className={s.forgotPasswordText}>
                <h1 className={s.forgotPasswordTitle}>
                  Check Your Inbox
                </h1>
                <p className={s.forgotPasswordSubtitle}>
                  We have sent a secure password reset link to your registered email address.
                </p>
              </div>
              <div className={s.forgotPasswordEmail}>
                {email}
              </div>
              <div className={s.forgotPasswordButtons}>
                <button type="button" className={s.forgotPasswordButton}>Resend Email</button>
                <span className={s.forgotPasswordSubtext}>
                  Didn't receive it? Please check your spam or promotions folder.
                </span>
                <div className={s.forgotPasswordLine}></div>
                <div className={s.forgotPasswordLogin}>
                  <span className={s.forgotPasswordLoginSpan}>
                    Back to <NavLink className={s.forgotPasswordLoginNav} to="/login">Login</NavLink>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.forgotPassword}>
      {loading && <Loader />}
      <header className={s.forgotPasswordHeader}>
        <NavLink className={s.forgotPasswordLink} to="/">
          <h1 className={s.forgotPasswordLogo}>Wine Library</h1>
        </NavLink>
        <NavLink to="/Wines" className={s.forgotPasswordBack}>
          <img src={ArrowLeft} alt="" className={s.forgotPasswordBackIcon} />
          <span className={s.forgotPasswordBackSpan}>
            Back to Catalog
          </span>
        </NavLink>
      </header>
      <div className={s.forgotPasswordBottom}>
        <div className={s.forgotPasswordBottomLeft}>
          <div className={s.forgotPasswordQuoteWrap}>
            <p className={s.forgotPasswordQuote}>
              “The vine is the earth's translator.”
            </p>
            <p className={s.forgotPasswordSubQuote}>
              Access rare biodynamic vintages
              and small-estate allocations
              directly from our temperature-controlled cellar.
            </p>
          </div>
          <img src={SigninImg} alt="" className={s.forgotPasswordImage} />
        </div>
        <div className={s.forgotPasswordBottomRight}>
          <div className={s.forgotPasswordRight}>
            <div className={s.forgotPasswordText}>
              <h1 className={s.forgotPasswordTitle}>
                  Reset Your Password
              </h1>
              <p className={s.forgotPasswordSubitle}>
                Enter your email address and
                we'll send you a link to choose a new password.
              </p>
            </div>
            <form onSubmit={handleSubmit} className={s.forgotPasswordForm}>
              <div className={s.forgotPasswordInputWrap}>
                <span className={s.forgotPasswordInputSpan}>
                  Email Address
                </span>
                <div className={s.forgotPasswordInputEmail}>
                  <input
                    type="email"
                    placeholder="Email"
                    className={s.forgotPasswordInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <p className={s.forgotPasswordError}>{error.message || "Something went wrong. Please try again."}</p>}
              <button type="submit" disabled={loading} className={s.forgotPasswordButton}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
            <div className={s.forgotPasswordLine}></div>
            <div className={s.forgotPasswordLogin}>
              <span className={s.forgotPasswordLoginSpan}>Remember your password?</span>
              <NavLink to="/login" className={s.forgotPasswordLoginNav}>
                Back to login
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
