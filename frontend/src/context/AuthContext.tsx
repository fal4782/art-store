import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import type { UserResponse } from "../types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponse | null;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  const refreshUser = async () => {
    try {
      const data = await userService.getProfile();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const login = (token: string) => {
    authService.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
