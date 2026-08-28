import Button from "../common/Button";
import { Link } from "react-router-dom";

import React from 'react'

const Navbar = () => {
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
          </div>
        </div>
    </header>
  )
}

export default Navbar