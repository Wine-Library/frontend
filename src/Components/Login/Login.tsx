import './Login.module.scss';
import s from './Login.module.scss';
import { useToast } from "@/context/ToastContext";
import { Loader } from "../Loader/Loader";
import { useAsyncCallback } from "@/utils/hooks";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // adjust path to wherever AuthProvider/useAuth live

export const Login = () => {
  const { loading, error, execute } = useAsyncCallback<void>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await execute(() => login(email, password));
      showToast('Logged in!');
    } catch {
      showToast('Failed to log in');
    }
  };

  return (
    <div className={s.login}>
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
      </form>
    </div>
  );
}

export default Login;