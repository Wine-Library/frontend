import { createContext, useContext, useEffect, useState } from "react";
import { changeUserDataApi, confirmEmailApi, getMyProfile, login as loginApi, refreshTokenApi, register as registerApi, resendEmailVerificationApi, type RegisterPayload } from "../api/auth";
import type { ChangeUserDataPayload, RegisterResponse, User } from "@/types";
import { tokenManager } from "../api/api";
import { Loader } from "@/Components/Loader/Loader";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  logout: () => void;
  confirmEmail: (token: string) => Promise<void>;
  refreshToken: (refreshToken: string) => Promise<void>;
  resendEmailVerification: (email: string) => Promise<void>;
  changeUserData: (payload: ChangeUserDataPayload) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      const savedRefreshToken = tokenManager.getRefreshToken();

      if (savedRefreshToken) {
        try {
          await refreshToken(savedRefreshToken);
        } catch (err) {
          console.error("Failed to restore session:", err);
          tokenManager.unset();
          tokenManager.clearRefreshToken();
        }
      }

      setIsInitializing(false);
    }

    initializeAuth();
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

  async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      return await registerApi(payload);
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  }

  async function changeUserData(payload: ChangeUserDataPayload) {
    try {
      const updatedUser = await changeUserDataApi(payload);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      return updatedUser;
    } catch (err) {
      console.error("Change failed:", err);
      throw err;
    }
  }

  async function confirmEmail(token: string) {
    const { token: sessionToken, refreshToken: newRefreshToken } = await confirmEmailApi(token);
    tokenManager.setRefreshToken(newRefreshToken);
    await establishSession(sessionToken);
  }

  async function refreshToken(oldRefreshToken: string) {
    const { token: newAccessToken, refreshToken: newRefreshToken } = await refreshTokenApi(oldRefreshToken);
    tokenManager.setRefreshToken(newRefreshToken);
    await establishSession(newAccessToken);
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
      const { token, refreshToken: newRefreshToken } = await loginApi(email, password);
      if (!token) throw new Error("Login response is missing token");
      tokenManager.setRefreshToken(newRefreshToken);
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
    tokenManager.clearRefreshToken();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (isInitializing) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ refreshToken, resendEmailVerification, changeUserData, user, token, login, confirmEmail, register, logout }}>
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