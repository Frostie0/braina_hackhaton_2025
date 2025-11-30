"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  getUserData,
  isAuthenticated as storageIsAuthenticated,
  clearUserData,
  type UserData,
} from "@/lib/storage/userStorage";

export interface AuthContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshFromStorage: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window === "undefined") return null;
    return getUserData();
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return storageIsAuthenticated();
  });
  const [loading] = useState(false);

  const refreshFromStorage = () => {
    if (typeof window === "undefined") return;
    const auth = storageIsAuthenticated();
    const storedUser = getUserData();
    setIsAuthenticated(auth);
    setUser(storedUser);
  };

  const logout = () => {
    clearUserData();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    loading,
    refreshFromStorage,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
