import Button from "../common/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

const AUTH_TOKEN_KEYS = ['token', 'jwtToken', 'authToken', 'accessToken', 'access_token', 'jwt'];

function hasValidToken() {
  for (const key of AUTH_TOKEN_KEYS) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) continue;
    const token = raw.replace(/^Bearer\s+/i, '').trim();
    if (!token) continue;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          continue;
        }
      }
      return true;
    } catch {
      return true;
    }
  }
  return false;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(hasValidToken());
  }, []);

  const handleLogout = () => {
    AUTH_TOKEN_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    localStorage.removeItem('user');
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="">
        <div className="navbar-container">
            <Link to="/" className="navbar-logo">ResumeAI</Link>
            <nav className="navbar-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#analysis">Analysis</a>
            </nav>
            <div className="navbar-actions">
              {loggedIn ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
          </div>
        </div>
    </header>
  )
}

export default Navbar