import { useAuth } from "@/context";
import { useRef, useState } from "react";
import s from './Signup.module.scss';
import { useToast } from "@/context/ToastContext";
import clsx from "clsx";
import { Loader } from "../Loader/Loader";
import { useAsyncCallback } from "@/utils/hooks";
import { getPasswordError } from "@/utils/utlis";
import { ConfirmEmail } from "../ConfirmEmail/ConfirmEmail";
import { getAuthErrorMessage } from "@/utils/errors";

export const Signup = () => {
  const { loading, execute } = useAsyncCallback<void>();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { showToast } = useToast();

  const isSubmittingRef = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setValidationError(null);

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setValidationError(passwordError);
      isSubmittingRef.current = false;
      return;
    }

    if (password !== repeatPassword) {
      setValidationError("Passwords do not match.");
      isSubmittingRef.current = false;
      return;
    }

    try {
      await execute(() => register(email, true, password, repeatPassword));
      setIsSignupSuccessful(true);
      showToast("Welcome to Wine Library");
    } catch (err) {
      setValidationError(getAuthErrorMessage(err));
    } finally {
      isSubmittingRef.current = false;
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
        {validationError && <p className={s.signupError}>{validationError}</p>}
        <label>
          <input checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} type="checkbox" name="age-verify" className={s.signupCheckbox} required />
          <span className={s.signupCheckboxBox}></span>
          <span className={s.signupCheckboxSpan}>I confirm that I am 18 years of age or older.</span>
        </label>
        <button type="submit" disabled={loading || !ageConfirmed} className={clsx(s.signupButton, !ageConfirmed && s.signupButtonDesibled)}>
          {loading ? <Loader /> : "Sign up"}
        </button>
      </form>) : (
          <ConfirmEmail />
        )
      }
    </div>
  );
}

export default Signup;