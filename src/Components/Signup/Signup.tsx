import s from './Signup.module.scss';
import SignupForm from "../SignupForm/SignupForm";
import ArrowLeft from '../../assets/icons/arrow-left-brown.svg';
import { NavLink } from 'react-router-dom';
import SignupImg from '../../assets/SignUpImage.png';

export const Signup = () => {
  return (
    <div className={s.signupWrap}>
      <header className={s.signupHeader}>
        <NavLink className={s.signupLogoLink} to="/">
          <h1 className={s.signupLogo}>Wine Library</h1>
        </NavLink>
          <NavLink to="/Wines" className={s.signupBack}>
            <img src={ArrowLeft} alt="" className={s.signupBackIcon} />
            <span className={s.signupBackSpan}>
              Back to Catalog
            </span>
          </NavLink>
      </header>
      <div className={s.signupBottom}>
        <div className={s.signupBottomLeft}>
          <div className={s.signupQuoteWrap}>
            <p className={s.signupQuote}>
              “The vine is the earth's translator.”
            </p>
            <p className={s.signupSubQuote}>
              Access rare biodynamic vintages
              and small-estate allocations
              directly from our temperature-controlled cellar.
            </p>
          </div>
          <img src={SignupImg} alt="" className={s.signupImage} />
        </div>
        <div className={s.signupBottomRight}>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export default Signup;
