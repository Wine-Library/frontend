import { instance } from "./api";
import type { AuthResponse, RegisterResponse, ResetPasswordPayload } from "@/types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await instance.post("/auth/login", { email, password });
  return data;
}

export async function register(
  email: string,
  olderThanEighteen: boolean,
  password: string,
  repeatPassword: string,
  name: string,
  surname: string,
  shippingAddress: string,
  phoneNumber: string,

): Promise<RegisterResponse> {
  const { data } = await instance.post("/auth/register", { email, olderThanEighteen, password, repeatPassword, name, surname, shippingAddress, phoneNumber });
  return data;
}

export async function confirmEmailApi(token: string): Promise<AuthResponse> {
  const { data } = await instance.get(`/auth/confirm-email?token=${token}`);
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