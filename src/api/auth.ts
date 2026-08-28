import { instance } from "./api";
import type { AuthResponse, ChangeUserDataPayload, RegisterResponse, ResetPasswordPayload, User } from "@/types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await instance.post("/auth/login", { email, password });
  return data;
}

export interface RegisterPayload {
  email: string;
  olderThanEighteen: boolean;
  password: string;
  repeatPassword: string;
  name: string;
  surname: string;
  city: string;
  street: string;
  zipCode: string;
  phoneNumber: string;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await instance.post("/auth/register", payload);
  return data;
}

export async function resendEmailVerificationApi(email: string): Promise<void> {
  await instance.get(`/auth/resend-verification`, { params: { email } });
}

export async function confirmEmailApi(token: string): Promise<AuthResponse> {
  const { data } = await instance.get(`/auth/confirm-email?token=${encodeURIComponent(token)}`);
  return data;
}

export async function forgotPasswordApi(email: string): Promise<void> {
  await instance.post(`/auth/forgot-password`, { email });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
  const { data } = await instance.post(`/auth/reset-password`, payload);
  return data;
}

export async function getMyProfile() {
  const { data } = await instance.get("/users/me");
  return data;
}

export async function changeUserDataApi(payload: ChangeUserDataPayload): Promise<User> {
  const { data } = await instance.put(`/users/me`, payload);
  return data;
}