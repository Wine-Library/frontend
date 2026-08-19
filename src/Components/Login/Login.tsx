import { Header } from '../Header/Header';
import LoginForm from '../LoginForm/LoginForm';
import s from './Login.module.scss';

export const Login = () => {
  return (
    <div className={s.loginWrap}>
      <Header />
      <LoginForm />
    </div>
  );
}

export default Login;