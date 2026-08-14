import { useState } from 'react';
import s from './AuthPage.module.scss';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className={s.auth}>
      {mode === "login" ? <Login /> : <Signup />}
      <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className={s.authButton}>
        {mode === "login" ? "Need an account ? Signup" : "Already have an account? Login"}
      </button>
    </div>
  )
}

export default AuthPage;