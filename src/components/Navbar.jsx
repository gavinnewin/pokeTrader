// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [dark, setDark] = useState(() => localStorage.theme === "dark");
  const [fullName, setFullName] = useState("Guest");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const name = localStorage.getItem("fullName");
    if (name) setFullName(name);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/home" className="nav-link">Home</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink>
        <NavLink to="/marketplace" className="nav-link">Marketplace</NavLink>
      </div>

      <div className="navbar-right">
        <div className="desktop-controls">
          <span className="username">{fullName}</span>
          <button
            className="mode-toggle"
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <button 
          className="hamburger-menu"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <span className="username">{fullName}</span>
          </div>
          <div className="mobile-menu-links">
            <NavLink to="/home" className="mobile-nav-link" onClick={toggleMobileMenu}>Home</NavLink>
            <NavLink to="/search" className="mobile-nav-link" onClick={toggleMobileMenu}>Search</NavLink>
            <NavLink to="/marketplace" className="mobile-nav-link" onClick={toggleMobileMenu}>Marketplace</NavLink>
          </div>
          <div className="mobile-menu-footer">
            <button
              className="mobile-mode-toggle"
              onClick={() => {
                setDark(d => !d);
                toggleMobileMenu();
              }}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
              <span>{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
