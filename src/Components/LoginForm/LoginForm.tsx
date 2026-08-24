import '../Login/Login.module.scss';
import s from '../Login/Login.module.scss';
import { useToast } from "@/context/ToastContext";
import { Loader } from "../Loader/Loader";
import { useAsyncCallback } from "@/utils/hooks";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/utils/errors";
import check from '../../assets/icons/check.svg';

import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { login } = useAuth();
  const { loading, error, execute } = useAsyncCallback<void>();
  const [keepLogged, setKeepLogged] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await execute(async () => {
        try {
          return await login(email, password);
        } catch (err) {
          throw new Error(getAuthErrorMessage(err));
        }
      });
      showToast('Logged in!');
      navigate('/profile')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to log in');
    }
  };

  return (
    <div className={s.login}>
      {loading && <Loader />}
      <div className={s.loginText}>
        <h1 className={s.loginTitle}>Welcome Back</h1>
        <span className={s.loginSpan}>Sign in to your account</span>
      </div>
      <form onSubmit={handleSubmit} className={s.loginForm}>
        <div className={s.loginInputWrap}>
          <span className={s.loginInputSpan}>Email Address</span>
          <span className={s.loginInputEmail}>
            <input type="email" placeholder="Email" className={s.loginInput} value={email} onChange={(e) => setEmail(e.target.value)} />
          </span>
        </div>
        <div className={s.loginInputWrap}>
          <span className={s.loginInputSpan}>Password</span>
          <input type={show ? "password" : "text"} placeholder="Password" className={s.loginInput} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShow(p => !p)} className={s.loginButtonShow}>
            {show ? "HIDE" : "SHOW"}
          </button>
        </div>
        {error && <p className={s.loginError}>{error.message}</p>}
        <div className={s.loginPassWrap}>
          <div className={s.loginCheckbox}>
            <button type="button" onClick={() => setKeepLogged(p => !p)} className={s.loginCheckboxInput} >
              {keepLogged && <img src={check} alt="" className="" />}
            </button>
              <span className={s.loginCheckboxSpan}>Remember Me</span>
          </div>
          <button type="button" onClick={() => navigate("/forgot-password")} className={s.loginForgotpass}>
            Forgot password?
          </button>
        </div>
        <button type="submit" disabled={loading} className={s.loginButton}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className={s.loginSignUp}>

        <div className={s.loginLine}></div>

        <div className={s.loginSign}>
          <span className={s.loginSignupSpan}>
            Don't have an account?
          </span>
          <button
            onClick={() => navigate("/signup")}
            className={s.loginButtonSignup}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;