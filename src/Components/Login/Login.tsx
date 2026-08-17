import './Login.module.scss';
import s from './Login.module.scss';
import { useToast } from "@/context/ToastContext";
import { Loader } from "../Loader/Loader";
import { useAsyncCallback } from "@/utils/hooks";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ConfirmEmail } from '../ConfirmEmail/ConfirmEmail';
<<<<<<< HEAD
import { getAuthErrorMessage } from "@/utils/errors";
=======
>>>>>>> 1ba30669a17689e92f7fe312e7d08f50cd2e5396

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
<<<<<<< HEAD
        } catch (err) {
          throw new Error(getAuthErrorMessage(err));
=======
        } catch {
          throw new Error('Invalid email or password');
>>>>>>> 1ba30669a17689e92f7fe312e7d08f50cd2e5396
        }
      });
      showToast('Logged in!');
    } catch {
      showToast('Failed to log in');
    }
  };

  return (
    <div className={s.login}>
      {forgotpass ? (<ConfirmEmail />) : (
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