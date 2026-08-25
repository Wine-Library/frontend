import { NavLink } from 'react-router-dom';
import { CheckYourEmail } from '../CheckYourEmail/CheckYourEmail';
import s from './CheckEmail.module.scss';
import ArrowLeft from '../../assets/icons/arrow-left-brown.svg';
import SigninImg from '../../assets/SignInImage.png';

export const CheckEmail = () => {
  const email = 'yourmail';

  return (
    <div className={s.checkEmail}>
      <header className={s.checkEmailHeader}>
        <NavLink className={s.checkEmailLogoLink} to="/">
          <h1 className={s.checkEmailLogo}>Wine Library</h1>
        </NavLink>
        <NavLink to="/Wines" className={s.checkEmailBack}>
          <img src={ArrowLeft} alt="" className={s.checkEmailBackIcon} />
          <span className={s.checkEmailBackSpan}>
            Back to Catalog
          </span>
        </NavLink>
      </header>
      <div className={s.checkEmailBottom}>
        <div className={s.checkEmailBottomLeft}>
          <div className={s.checkEmailQuoteWrap}>
            <p className={s.checkEmailQuote}>
              “The vine is the earth's translator.”
            </p>
            <p className={s.checkEmailSubQuote}>
              Access rare biodynamic vintages
              and small-estate allocations
              directly from our temperature-controlled cellar.
            </p>
          </div>
          <img src={SigninImg} alt="" className={s.checkEmailImage} />
        </div>
        <div className={s.checkEmailBottomRight}>
          <CheckYourEmail email={email} />
        </div>
      </div>
    </div>
  )
}