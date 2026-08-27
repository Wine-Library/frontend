import LoginForm from '../LoginForm/LoginForm';
import s from './Login.module.scss';
import ArrowLeft from '../../assets/icons/arrow-left-brown.svg';
import { NavLink } from 'react-router-dom';

import SigninImg from '../../assets/SignInImage.png';
import { Loader } from '../Loader/Loader';
import { useAsyncCallback } from '@/utils/hooks';

export const Login = () => {
  const { loading } = useAsyncCallback<void>();

  return (
    <div className={s.loginWrap}>
      {loading && <Loader />}
      <header className={s.loginHeader}>
        <NavLink className={s.loginLogoLink} to="/">
          <h1 className={s.loginLogo}>Wine Library</h1>
        </NavLink>
        <NavLink to="/Wines" className={s.loginBack}>
          <img src={ArrowLeft} alt="" className={s.loginBackIcon} />
          <span className={s.loginBackSpan}>
            Back to Catalog
          </span>
        </NavLink>
      </header>
      <div className={s.loginBottom}>
        <div className={s.loginBottomLeft}>
          <div className={s.loginQuoteWrap}>
            <p className={s.loginQuote}>
              “The vine is the earth's translator.”
            </p>
            <p className={s.loginSubQuote}>
              Access rare biodynamic vintages
              and small-estate allocations
              directly from our temperature-controlled cellar.
            </p>
          </div>
          <img src={SigninImg} alt="" className={s.loginImage} />
        </div>
        <div className={s.loginBottomRight}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;