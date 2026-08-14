// VerifyEmail.tsx
import { useState } from "react";
import { verifyEmail, resendVerificationCode } from "@/api/auth";
import { useToast } from "@/context/ToastContext";
import s from './VerifyEmail.module.scss';
import './VerifyEmail.module.scss';

type Props = {
  email: string;
};

export const VerifyEmailPage: React.FC<Props> = ({ email }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verifyEmail(email, code);
      showToast("Email verified successfully!");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await resendVerificationCode(email);
      showToast("Code resent!");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={s.verify}>
      <p className={s.verifyText} >We sent a verification code to <strong>{email}</strong></p>
      <form className={s.verifyForm} onSubmit={handleSubmit}>
        <input
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