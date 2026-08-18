import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import s from './ForgotPass.module.scss';
import { Loader } from '../Loader/Loader';
import { confirmEmailApi } from '@/api/auth';
import { useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import type { AuthResponse } from '@/types';
import { useAsyncCallback } from '@/utils/hooks';

export const ForgotPass = () => {
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
        showToast("Password changed! Please log in.");
      });
  }, [token, execute, navigate, showToast]);

  if (!token) {
    return (
      <div className={s.forgotPass}>
        <p className={s.forgotPassError} >Forgot password recovery</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={s.forgotPassEmail}>
        <Loader />
        <p>Verifying...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.forgotPassEmail}>
        <p>{error.message || "You cannot change your password."}</p>
        <Link to="/signup">Sign up again</Link>
      </div>
    );
  }

  return null;
}