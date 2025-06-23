import { createContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../utils/types";
import { loginUser, signupUser, getCurrentUser } from "../utils/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch {
          // Token is invalid, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    setUser(response.user);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);
  };

  const signup = async (email: string, name: string, password: string) => {
    const response = await signupUser({ email, name, password });
    setUser(response.user);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
