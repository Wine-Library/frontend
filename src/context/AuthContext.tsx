import { createContext, useContext, useEffect, useState } from "react";
import { changeUserDataApi, confirmEmailApi, getMyProfile, login as loginApi, register as registerApi, resendEmailVerificationApi, type RegisterPayload } from "../api/auth";
import type { ChangeUserDataPayload, User } from "@/types";
import { token as tokenManager } from "../api/api";
import { Loader } from "@/Components/Loader/Loader";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  confirmEmail: (token: string) => Promise<void>;
  resendEmailVerification: (email: string) => Promise<void>;
  changeUserData: (payload: ChangeUserDataPayload) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        tokenManager.set(savedToken); 
        setToken(savedToken);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse saved user, clearing corrupted auth state:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsInitializing(false); // done checking, safe to render the app now
  }, []);

  async function establishSession(newToken: string) {
    tokenManager.set(newToken);
    const profile = await getMyProfile();
    if (!profile) {
      throw new Error("Failed to load profile");
    }
    setUser(profile);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(profile));
  }

  async function register(payload: RegisterPayload) {
    try {
      await registerApi(payload);
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  }

  async function changeUserData(payload: ChangeUserDataPayload) {
    try {
      const updatedUser = await changeUserDataApi(payload);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Change failed:", err);
      throw err;
    }
  }

  async function confirmEmail(token: string) {
    const { token: sessionToken } = await confirmEmailApi(token);
    await establishSession(sessionToken);
  }

  async function resendEmailVerification(email: string) {
    try {
      await resendEmailVerificationApi(email);
    } catch (err) {
      console.error("Resend email verification failed:", err);
      throw err;
    }
  }

  async function login(email: string, password: string) {
    try {
      const { token } = await loginApi(email, password);
      if (!token) throw new Error("Login response is missing token");
      await establishSession(token);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    tokenManager.unset();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (isInitializing) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ resendEmailVerification, changeUserData, user, token, login, confirmEmail, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context
}