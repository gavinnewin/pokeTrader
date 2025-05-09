// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [dark, setDark] = useState(
    () => localStorage.theme === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/home" className="nav-link">Home</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink>
        <NavLink to="/marketplace" className="nav-link">Marketplace</NavLink>
      </div>

      <div className="navbar-right">
        {/* 1) User name */}
        <span className="username">Bessie Cooper</span>

        {/* 2) Profile avatar */}
        <img 
          src="/avatar.jpg" 
          alt="Profile" 
          className="profile-pic" 
        />

        {/* 3) Dark/light mode toggle */}
        <button 
          className="mode-toggle" 
          onClick={() => setDark(d => !d)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </div>
    </nav>
  );
}
