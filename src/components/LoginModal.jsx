'use client';

// This JSX file handles the the popup that appears when the hacker
// chooses to login 

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Lock } from "lucide-react";


// LoginModal -  Modal for hacker authentication

// CURRENT LOGIN IS HARD CODED:
// username: hacker
// password: htn2026

export default function LoginModal({ onClose }) {
  const { login, loginError, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) modalRef.current.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const success = login(username, password);
    if (success) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Hacker login"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative mx-4 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl outline-none md:p-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close login modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Hacker Login</h2>
          <p className="text-center text-sm text-muted-foreground">
            Sign in to access private events and exclusive content.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
              className="w-full rounded border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
