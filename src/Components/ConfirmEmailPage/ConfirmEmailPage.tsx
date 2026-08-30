import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import s from './ConfirmEmailPage.module.scss';
import { useAsyncCallback } from '@/utils/hooks';
import { Loader } from '../Loader/Loader';
import { useToast } from '@/context/ToastContext';
import { confirmEmailApi } from '@/api/auth';
import { getErrorMessage } from '@/utils/errors';
import type { AuthResponse } from '@/types';

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { execute, loading, error } = useAsyncCallback<AuthResponse>();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    execute(() => confirmEmailApi(token))
      .then(() => {
        navigate("/login");
        showToast("Email confirmed! Please log in.", "success");
      });
  }, [token, execute, navigate, showToast]);

  if (!token) {
    return (
      <div className={s.confirmEmailPage}>
        <p className={s.confirmEmailPageError}>
          This link looks incomplete. Please use the link from your verification email.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={s.confirmEmailPage}>
        <Loader />
        <p className={s.confirmEmailPageText}>Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.confirmEmailPage}>
        <p className={s.confirmEmailPageText}>
          {getErrorMessage(error, {
            400: "This link is invalid or has expired.",
            404: "This link is invalid or has expired.",
            410: "This link is invalid or has expired.",
          })}
        </p>
        <Link className={s.confirmEmailPageText} to="/signup">Sign up again</Link>
      </div>
    );
  }

  return null;
}