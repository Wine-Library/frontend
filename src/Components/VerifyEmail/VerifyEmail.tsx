import { useState } from "react";
import { verifyEmail, resendVerificationCode } from "@/api/auth";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context";
import s from './VerifyEmail.module.scss';
import './VerifyEmail.module.scss';

type Props = {
  email: string;
  password: string;
};

export const VerifyEmailPage: React.FC<Props> = ({ email, password }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verifyEmail(email, code);
      showToast("Email verified successfully!");
      try {
        await login(email, password);
      } catch (err) {
        setError("Verified, but couldn't log you in automatically. Please log in.");
      }
    } catch (err) {
      setError("Code does not match the one we sent you");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await resendVerificationCode(email);
      showToast("Code resent!");
    } catch (err) {
     if (err instanceof Error) setError("We cannot send a code to you right now");
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
        {error && <p className={s.verifyError}>{error}</p>}
        <button className={s.verifyButton} type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <button className={s.verifyButton} onClick={handleResend}>Resend code</button>
    </div>
  );
};