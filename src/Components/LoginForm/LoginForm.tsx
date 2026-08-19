import '../Login/Login.module.scss';
import s from '../Login/Login.module.scss';
import { useToast } from "@/context/ToastContext";
import { Loader } from "../Loader/Loader";
import { useAsyncCallback } from "@/utils/hooks";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/utils/errors";

import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { login } = useAuth();
  const { loading, error, execute } = useAsyncCallback<void>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

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
      navigate('/auth')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to log in');
    }
  };

  return (
    <div className={s.login}>
      <form onSubmit={handleSubmit} className={s.loginForm}>
        <input type="email" placeholder="Email" className={s.loginInput} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className={s.loginInput} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className={s.loginError}>{error.message}</p>}
        <button type="submit" disabled={loading} className={s.loginButton}>
          {loading ? <Loader /> : "Log in"}
        </button>
        <button type="button" onClick={() => navigate("/forgot-password")} className={s.loginForgotpass}>
          Forgot password?
        </button>
      </form>

      <button
        onClick={() => navigate("/signup")}
        className={s.loginButtonSignup}
      >
        Need an account? Signup
      </button>
    </div>
  );
}

export default LoginForm;