import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, login as loginApi, register as registerApi } from "../api/auth";
import type { User } from "@/types";
import { token as tokenManager } from "../api/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, age: number, password: string, repeatPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        tokenManager.set(savedToken);
      } catch (err) {
        console.error("Failed to parse saved user, clearing corrupted auth state:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

 async function register(email: string, age: number, password: string, repeatPassword: string) {
    try {
      const data = await registerApi(email, age, password, repeatPassword);
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  }

  async function login(email: string, password: string) {
    try {
      const { token } = await loginApi(email, password);
      if (!token) {
        throw new Error("Login response is missing token");
      }
      tokenManager.set(token);
      const user = await getMyProfile();
      if (!user) {
        throw new Error("Failed to load profile after login");
      }
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
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

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
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