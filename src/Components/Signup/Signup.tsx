import { useAuth } from "@/context";
import { useState } from "react";
import s from './Signup.module.scss';
import { useToast } from "@/context/ToastContext";
import { VerifyEmailPage } from "../VerifyEmail/VerifyEmail";
import clsx from "clsx";
import { Loader } from "../Loader/Loader";
import axios from "axios";

export const Signup = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    const age = ageConfirmed ? 18 : 0;

    setLoading(true);
    try {
      await register(email, age, password, repeatPassword);
      setIsSignupSuccessful(true);
      showToast("Welcome to Wine Library");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError("This email is already taken");
      } else if (axios.isAxiosError(err) && !err.response) {
        setError("Can't reach the server right now. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
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
        <input
          type="password"
          placeholder="Password"
          className={s.signupInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <input type="password" className={s.signupInput} placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
        {error && <p className={s.signupError}>{error}</p>}
        <label>
          <input checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} type="checkbox" name="age-verify" className={s.signupCheckbox} required />
          <span className={s.signupCheckboxBox}></span>
          <span className={s.signupCheckboxSpan}>I confirm that I am 18 years of age or older.</span>
        </label>
        <button  type="submit" disabled={loading || !ageConfirmed} className={clsx(s.signupButton, !ageConfirmed && s.signupButtonDesibled)}>
          {loading ? <Loader /> : "Sign up"}
        </button>
      </form>) : (
          <VerifyEmailPage email={email} password={password} />
      )
      }
    </div>
  );
}

export default Signup;