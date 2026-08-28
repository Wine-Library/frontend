import { useAuth } from "@/context";
import { useToast } from "@/context/ToastContext";
import { getAuthErrorMessage } from "@/utils/errors";
import { useAsyncCallback } from "@/utils/hooks";
import { getPasswordError } from "@/utils/utlis";
import clsx from "clsx";
import { useState, useRef } from "react";
import { AddressAutocomplete } from "../AddressAutocomplete/AddressAutocomplete";
import s from '../Signup/Signup.module.scss';
import check from '../../assets/icons/check.svg';
import { NavLink, useNavigate } from "react-router-dom";
import { ChoosePasswordField } from "../ChoosePass/ChoosePass";
import type { RegisterResponse } from "@/types";

export const Signup = () => {
    const { loading, execute } = useAsyncCallback<RegisterResponse>();
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [ageConfirmed, setAgeConfirmed] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [showRepeat, setShowRepeat] = useState(false);

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
        await execute(() =>
          register({ email, olderThanEighteen: ageConfirmed, password, repeatPassword, name, surname, city, street, zipCode, phoneNumber })
        );
        showToast("Welcome to Wine Library");
        navigate("/check-email", { state: { email } });
      } catch (err) {
        setValidationError(getAuthErrorMessage(err));
      } finally {
        isSubmittingRef.current = false;
    }
  }
  
  return (
    <div className={s.signup}>
      <form onSubmit={handleSubmit} className={s.signupForm}>
        <div className={s.singupName}>
          <div className={s.signupInputWrap}>
            <span className={s.signupSpan}>First Name</span>
              <input
                type="text"
                name=""
                className={clsx(s.signupInput, s.signupInputName)}
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="given-name"
                required
              />
          </div>
          <div className={s.signupInputWrap}>
          <span className={s.signupSpan}>Last Name</span>
            <input
              type="text"
              name=""
              className={clsx(s.signupInput, s.signupInputName)}
              placeholder="Last name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div className={s.signupInputWrap}>
        <span className={s.signupSpan}>Email Address</span>
          <input
            type="email"
            placeholder="Email"
            className={s.signupInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <ChoosePasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className={s.signupInputWrap}>
        <span className={s.signupSpan}>Confirm Password</span>
          <input
            type={showRepeat ? "password" : "text"}
            className={s.signupInput}
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button type="button" onClick={() => setShowRepeat(p => !p)} className={s.signupButtonShow}>
            {showRepeat ? "SHOW" : "HIDE"}
          </button>
        </div>

        <div className={s.signupInputWrap}>
        <span className={s.signupSpan}>PHONE NUMBER</span>
          <input
            type="tel"
            className={s.signupInput}
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            autoComplete="tel"
            required
          />
        </div>
        <div className={s.signupShipping}>
          <div className={s.signupInputWrap}>
            <span className={s.signupSpan}>STREET</span>
            <input
              type="text"
              className={s.signupInput}
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              autoComplete="address-line1"
              required
            />
          </div>
          <div className={s.signupInputWrap}>
            <span className={s.signupSpan}>CITY</span>
            <input
              type="text"
              className={s.signupInput}
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
              required
            />
          </div>
          <div className={s.signupInputWrap}>
            <span className={s.signupSpan}>POST CODE</span>
            <input
              type="text"
              className={s.signupInput}
              placeholder="Post code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              autoComplete="postal-code"
              required
            />
          </div>
        </div>
        {validationError && <p className={s.signupError}>{validationError}</p>}
        <label className={s.signupCheckboxWrap}>
          <button type="button" onClick={() => setAgeConfirmed(p => !p)} name="age-verify" className={s.signupCheckbox} >
            {ageConfirmed && <img src={check} alt="" className="" />}
          </button>
          <span className={s.signupCheckboxSpan}>I confirm that I am 18 years of age or older.</span>
        </label>
        <button type="submit" disabled={loading || !ageConfirmed} className={clsx(s.signupButton, !ageConfirmed && s.signupButtonDesibled)}>
          {loading ? "Creating Your Account..." : "Create Account"}
        </button>

        <div className={s.signupLine}></div>

        <div className={s.signupHaveAccount}>
          <span className={s.signupHaveAccountSpan}>
            Already have an account?
          </span>
          <NavLink className={s.signupHaveAccountNav} to="/login">
            Sign In
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default Signup;