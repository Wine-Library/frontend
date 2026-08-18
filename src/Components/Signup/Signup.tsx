import s from './Signup.module.scss';
import SignupForm from "../SignupForm/SignupForm";
import { Header } from "../Header/Header";

export const Signup = () => {
  return (
    <div className={s.signupWrap}>
      <Header />
      <SignupForm />
    </div>
  );
}

export default Signup;
