import { useState } from "react";
import { verifyEmail, resendVerificationCode } from "@/api/auth";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context";
import s from './VerifyEmail.module.scss';
import './VerifyEmail.module.scss';
import { useAsyncCallback } from "@/utils/hooks";
import { getErrorMessage } from "@/utils/errors";

type Props = {
  email: string;
  password: string;
};

export const VerifyEmailPage: React.FC<Props> = ({ email, password }) => {
  const [code, setCode] = useState("");
  const { loading: resendLoading, error: resendError, execute: executeResend } = useAsyncCallback<void>();
  const [codeSent, setCodeSent] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth();

  async function handleSubmit() {
    try {
      await executeResend(() => verifyEmail(email, code).catch((err) => {
        throw new Error(getErrorMessage(err));
      }));
      showToast("Email verified successfully!");

      try {
        await login(email, password);
      } catch {
        showToast("Verified, but couldn't log you in automatically. Please log in.");
      }
    } catch {
      // verifyEmail failed — execute() already set `error` for the UI to render.
    }
  }

  async function handleResend() {
    try {
      await executeResend(() => resendVerificationCode(email).catch((err) => {
        throw new Error(getErrorMessage(err));
      }));
      setCodeSent(true);
      showToast("Code resent!");
    } catch {
      showToast("Couldn't resend the code. Please try again.");
    }
  }

  return (
    <div className={s.verify}>
      <p className={s.verifyText} >We sent a verification code to <strong>{email}</strong></p>
      <form className={s.verifyForm} onSubmit={handleSubmit}>
        <label htmlFor="code" className={s.visuallyHidden}>Verification code</label>
        <input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          className={s.verifyInput}
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {resendError && <p className={s.verifyError}>{resendError.message}</p>}
        <button className={s.verifyButton} type="submit" disabled={resendLoading}>
          {resendLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <button className={s.verifyButton} onClick={handleResend}>{codeSent ? "Code sent!" : "Resend code"}</button>
    </div>
  );
};