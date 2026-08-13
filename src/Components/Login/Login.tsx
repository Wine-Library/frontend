import { useAuth } from "@/context";
import { useState } from "react";
import './Login.module.scss';
import s from './Login.module.scss';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.login}>
      <form onSubmit={handleSubmit} action="login" className={s.loginForm}>
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
        {error && <p className={s.loginError}>{error}</p>}
        <button type="submit" disabled={loading} className={s.loginButton}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}

export default Login;