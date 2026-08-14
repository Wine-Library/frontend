import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/auth";
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
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      tokenManager.set(savedToken);
    }
  }, []);

 async function register(email: string, age: number, password: string, repeatPassword: string) {
    try {
      const data = await registerApi(email, age, password, repeatPassword);
      setUser(data.user);
      setToken(data.token);
      tokenManager.set(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  }

  async function login(email: string, password: string) {
    try {
      const data = await loginApi(email, password);
      setUser(data.user);
      setToken(data.token);
      tokenManager.set(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
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