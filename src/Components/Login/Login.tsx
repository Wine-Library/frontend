import './Login.module.scss';
import s from './Login.module.scss';
import { useToast } from "@/context/ToastContext";
import { Loader } from "../Loader/Loader";
import { useAsyncCallback } from "@/utils/hooks";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/utils/errors";
import { ForgotPass } from '../ForgotPass/ForgotPass';

export const Login = () => {
  const { login } = useAuth();
  const { loading, error, execute } = useAsyncCallback<void>();

  const [email, setEmail] = useState("");
  const [forgotpass, setForgotpass] = useState(false);
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    } catch {
      showToast('Failed to log in');
    }
  };

  return (
    <div className={s.login}>
      {forgotpass ? (<ForgotPass />) : (
      <form onSubmit={handleSubmit} className={s.loginForm}>
        <input
          type="email"
          placeholder="Email"
          className={s.loginInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={s.loginInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={s.loginError}>{error.message}</p>}
        <button type="submit" disabled={loading} className={s.loginButton}>
          {loading ? (<Loader />) : "Log in"}
        </button>
        <button type="button" onClick={() => setForgotpass(true)} className={s.loginForgotpass}>Forgot password?</button>
      </form>
      )}
    </div>
  );
}

export default Login;