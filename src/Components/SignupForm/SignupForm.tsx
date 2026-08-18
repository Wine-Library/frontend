import { useAuth } from "@/context";
import { useToast } from "@/context/ToastContext";
import { getAuthErrorMessage } from "@/utils/errors";
import { useAsyncCallback } from "@/utils/hooks";
import { getPasswordError } from "@/utils/utlis";
import clsx from "clsx";
import { useState, useRef } from "react";
import { AddressAutocomplete } from "../AddressAutocomplete/AddressAutocomplete";
import { CheckYourEmail } from "../CheckYourEmail/CheckYourEmail";
import { Loader } from "../Loader/Loader";
import s from '../Signup/Signup.module.scss';

export const Signup = () => {
  const { loading, execute } = useAsyncCallback<void>();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState("");
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
      await execute(() => register(email, ageConfirmed, password, repeatPassword, name, surname, shippingAddress, phoneNumber));
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
          autoComplete="new-password"
          required
        />
        <input
          type="password"
          className={s.signupInput}
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <input
          type="text"
          className={s.signupInput}
          placeholder="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          required
        />
        <input
          type="text"
          className={s.signupInput}
          placeholder="Last name"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          autoComplete="family-name"
          required
        />

        <input
          type="tel"
          className={s.signupInput}
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="tel"
          required
        />

        <AddressAutocomplete initialValue={shippingAddress} onSelect={(value) => setShippingAddress(value)} />
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
          <CheckYourEmail />
        )
      }
    </div>
  );
}

export default Signup;