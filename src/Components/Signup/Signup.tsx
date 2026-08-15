import { useAuth } from "@/context";
import { useState } from "react";
import s from './Signup.module.scss';
import { useToast } from "@/context/ToastContext";
import { VerifyEmailPage } from "../VerifyEmail/VerifyEmail";
import clsx from "clsx";
import { Loader } from "../Loader/Loader";
import axios from "axios";
import { useAsyncCallback } from "@/utils/hooks";
import { getPasswordError } from "@/utils/utlis";

export const Signup = () => {
  const { loading, error, execute } = useAsyncCallback<void>();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (!ageConfirmed) {
      setValidationError("You must confirm you meet the minimum age requirement.");
      return;
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (password !== repeatPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await execute(() => register(email, 18, password, repeatPassword)); // swap 18 for a real age field if you have one
      setIsSignupSuccessful(true);
      showToast("Welcome to Wine Library");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setValidationError("This email is already taken");
      } else if (axios.isAxiosError(err) && !err.response) {
        setValidationError("Can't reach the server right now. Please try again.");
      } else {
        setValidationError("Something went wrong. Please try again.");
      }
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
        {error && <p className={s.signupError}>{error.message}</p>}
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