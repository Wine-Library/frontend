import { type SubmitEvent, useState } from "react";
import s from "./ForgotPass.module.scss";
import { useAsyncCallback } from "@/utils/hooks";
import { Loader } from "../Loader/Loader";
import { useToast } from "@/context/ToastContext";
import { forgotPasswordApi } from "@/api/auth";
import { Link } from "react-router-dom";
import { Header } from "../Header/Header";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { execute, loading, error } = useAsyncCallback<void>();
  const { showToast } = useToast();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await execute(() => forgotPasswordApi(email));
      setSubmitted(true);
      showToast("Check your email for a reset link.");
    } catch {
      // error rendered below
    }
  }

  if (submitted) {
    return (
      <div>
        <Header />
        <p className={s.forgotPasswordMessage}>If an account exists for that email, a reset link has been sent.</p>
      </div>
    );
  }

  return (
    <div className={s.forgotPassword}>
      <Header />
      <form onSubmit={handleSubmit} className={s.forgotPasswordForm}>
        <input
          type="email"
          placeholder="Email"
          className={s.forgotPasswordInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className={s.forgotPasswordError}>{error.message || "Something went wrong. Please try again."}</p>}
        <button type="submit" disabled={loading} className={s.forgotPasswordButton}>
          {loading ? <Loader /> : "Send reset link"}
        </button>

        <Link to="/login" className={s.forgotPassBackLink}>Back to login</Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
