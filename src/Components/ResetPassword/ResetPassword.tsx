import { useState, type FormEvent } from 'react';
import s from './ResetPassword.module.scss';
import { resetPassword } from '@/api/auth';
import { useToast } from '@/context/ToastContext';
import type { AuthResponse, ResetPasswordFormValues } from '@/types';
import { useAsyncCallback } from '@/utils/hooks';
import { getPasswordError } from '@/utils/utlis';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader } from '../Loader/Loader';
import { Header } from '../Header/Header';

export const ResetPassword = () => {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { execute, loading, error } = useAsyncCallback<AuthResponse>();

  const [form, setForm] = useState<ResetPasswordFormValues>({
    newPassword: "",
    repeatPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className={s.resetPasswordPage}>
        <p className={s.resetPasswordPageError}>
          This link looks incomplete. Please use the link from your password reset email.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return; 

    setValidationError(null);

    const passwordError = getPasswordError(form.newPassword);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }
    
    if (form.newPassword !== form.repeatPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await execute(() => resetPassword({ token, newPassword: form.newPassword, repeatPassword: form.repeatPassword }));
      showToast("Password reset! You can now log in.");
      navigate("/");
    } catch {
      // error state handled below via useAsyncCallback
    }
  }

  return (
    <div className={s.resetPassword}>
      <Header />
      <form onSubmit={handleSubmit} className={s.resetPasswordForm}>
        <input
          type="password"
          placeholder="New password"
          className={s.resetPasswordInput}
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Repeat new password"
          className={s.resetPasswordInput}
          value={form.repeatPassword}
          onChange={(e) => setForm({ ...form, repeatPassword: e.target.value })}
          required
        />
        {validationError && <p className={s.resetPasswordError}>{validationError}</p>}
        {error && <p className={s.resetPasswordError}>{error.message || "This link is invalid or has expired."}</p>}
        <button type="submit" disabled={loading} className={s.resetPasswordButton}>
          {loading ? <Loader /> : "Reset password"}
        </button>
      </form>
    </div>
  );
}