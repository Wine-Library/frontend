import { useAuth } from "@/context";
import { useToast } from "@/context/ToastContext";
import { getAuthErrorMessage } from "@/utils/errors";
import { useAsyncCallback } from "@/utils/hooks";
import { getPasswordError } from "@/utils/utlis";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { AddressAutocomplete } from "../AddressAutocomplete/AddressAutocomplete";
import { Loader } from "../Loader/Loader";
import s from '../Signup/Signup.module.scss';
import check from '../../assets/icons/check.svg';
import { NavLink, useNavigate } from "react-router-dom";
import { ChoosePasswordField } from "../ChoosePass/ChoosePass";

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
      await execute(() => register(email, ageConfirmed, password, repeatPassword, name, surname, shippingAddress, phoneNumber));
      setIsSignupSuccessful(true);
      showToast("Welcome to Wine Library");
    } catch (err) {
      setValidationError(getAuthErrorMessage(err));
    } finally {
      isSubmittingRef.current = false;
    }
  }

  useEffect(() => {
    if (isSignupSuccessful) {
      navigate("/check-email", { state: { email } });
    }
  }, [isSignupSuccessful, email, navigate]);

  return (
    <div className={s.signup}>
      {!isSignupSuccessful && (<form onSubmit={handleSubmit} className={s.signupForm}>
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

        <AddressAutocomplete initialValue={shippingAddress} onSelect={(value) => setShippingAddress(value)} />
        {validationError && <p className={s.signupError}>{validationError}</p>}
        <label className={s.signupCheckboxWrap}>
          <button type="button" onClick={() => setAgeConfirmed(p => !p)} name="age-verify" className={s.signupCheckbox} >
            {ageConfirmed && <img src={check} alt="" className="" />}
          </button>
          <span className={s.signupCheckboxSpan}>I confirm that I am 18 years of age or older.</span>
        </label>
        <button type="submit" disabled={loading || !ageConfirmed} className={clsx(s.signupButton, !ageConfirmed && s.signupButtonDesibled)}>
          {loading ? <Loader /> : "Create Account"}
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
      </form>)}
    </div>
  );
}

export default Signup;