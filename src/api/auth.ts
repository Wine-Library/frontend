import { instance } from "./api";
import type { AuthResponse } from "@/types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await instance.post("/auth/login", { email, password });
  return data;
}

export async function register(
  email: string,
  age: number,
  password: string,
  repeatPassword: string
): Promise<AuthResponse> {
  const { data } = await instance.post("/auth/register", { email, age, password, repeatPassword });
  return data;
}

export async function getMyProfile() {
  const { data } = await instance.get("/users/me");
  return data;
}