import { instance } from "./api";
import type { AuthResponse, RegisterResponse } from "@/types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await instance.post("/auth/login", { email, password });
  return data;
}

export async function register(
  email: string,
  olderThanEighteen: boolean,
  password: string,
  repeatPassword: string
): Promise<RegisterResponse> {
  const { data } = await instance.post("/auth/register", { email, olderThanEighteen, password, repeatPassword });
  return data;
}

export async function confirmEmailApi(token: string): Promise<AuthResponse> {
  const { data } = await instance.post(`/auth/confirm-email?token=${token}`);
  return data;
}

export async function getMyProfile() {
  const { data } = await instance.get("/users/me");
  return data;
}