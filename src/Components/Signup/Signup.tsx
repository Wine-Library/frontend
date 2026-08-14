import { useAuth } from "@/context";
import { useState } from "react";
import s from './Signup.module.scss';
import { useToast } from "@/context/ToastContext";
import { VerifyEmailPage } from "../VerifyEmail/VerifyEmail";

export const Signup = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);

  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await register(email, age, password, repeatPassword);
        setIsSignupSuccessful(true); // just means the API call succeeded, nothing about token/user
        showToast("Welcome to Wine Library");
    } catch (err) {
        if (err instanceof Error) setError(err.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className={s.signup}>
      {!isSignupSuccessful ? (<form onSubmit={handleSubmit} className={s.signupForm}>
        <input
          type="email"
          placeholder="Email"
          className={s.signupInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="number" min={18} value={age} placeholder="Age" className={s.signupInput} onChange={(e) => setAge(Number(e.target.value))} required />
        <input
          type="password"
          placeholder="Password"
          className={s.signupInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <input type="password" className={s.signupInput} placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
        {error && <p className={s.signupError}>{error}</p>}
        <button type="submit" disabled={loading} className={s.signupButton}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>) : (
          <VerifyEmailPage email={email} />
      )
      }
    </div>
  );
}

export default Signup;