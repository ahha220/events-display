'use client';

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import { LogIn, LogOut, Code2 } from "lucide-react";

/**
 * Navbar - top header bar with Hackathon Global branding and login/logout button.
 */
export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="border-b border-border bg-gradient-to-r">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6"
        style={{
        background: 'linear-gradient(to right, hsl(340, 80%, 95%), hsl(340, 80%, 90%), hsl(340, 80%, 85%))',

      }}>          
      
      {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2"
            aria-label="Go to homepage"
          >
            <img 
              src="tech_talk.png" 
              className = "h-12 w-12" 
              alt="Logo"/>
            <div>
              <span className="block text-lg font-bold leading-tight"
              style ={{color: '0A3173' }}
              >
                Hackathon Global 2026
              </span>
              <span className="block text-xs text-muted-foreground">
                Event Schedule
              </span>
            </div>
          </a>

          {/* Auth button */}
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-primary bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              style = {{boxShadow: '5px 6px 1px rgba(0,0,0,0.1'}}              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 rounded-full border border-primary bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              style = {{boxShadow: '5px 6px 1px rgba(0,0,0,0.1'}}
              aria-label="Log in as a hacker"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span>Hacker Login</span>
            </button>
          )}
        </nav>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
