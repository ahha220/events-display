'use client';

import { createContext, useContext, useState, useCallback } from "react";

/**
 * AuthContext provides authentication state and methods throughout the app.
 * Hardcoded credentials: username "hacker", password "htn2026".
 * Logged-in users can see both public and private events.
 */
const AuthContext = createContext(null);

const VALID_USERNAME = "hacker";
const VALID_PASSWORD = "htn2026";

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const login = useCallback((username, password) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError("");
      return true;
    }
    setLoginError("Invalid username or password. Please try again.");
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setLoginError("");
  }, []);

  const clearError = useCallback(() => {
    setLoginError("");
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, loginError, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
