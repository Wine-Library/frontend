import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import s from './ConfirmEmail.module.scss';
import { useAsyncCallback } from '@/utils/hooks';
import { useEffect } from 'react';
import { Loader } from '../Loader/Loader';
import { useToast } from '@/context/ToastContext';
import { confirmEmailApi } from '@/api/auth';
import type { AuthResponse } from '@/types';

export const ConfirmEmail = () => {
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
      showToast("Email confirmed! Please log in.");
    });
}, [token]);

  if (!token) {
    return (
      <div className={s.confirmEmail}>
        <p className={s.confirmEmailError} >This link looks incomplete. Please use the link from your verification email.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={s.confirmEmail}>
        <Loader />
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.confirmEmail}>
        <p>{error.message || "This link is invalid or has expired."}</p>
        <Link to="/signup">Sign up again</Link>
      </div>
    );
  }

  return null;
}