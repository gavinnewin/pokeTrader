// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [dark, setDark] = useState(() => localStorage.theme === "dark");
  const [profilePic, setProfilePic] = useState("/avatar.png");
  const [fullName, setFullName] = useState("Guest");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const pic = localStorage.getItem("profilePic");
    const name = localStorage.getItem("fullName");
    if (pic) setProfilePic(pic);
    if (name) setFullName(name);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/home" className="nav-link">Home</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink>
        <NavLink to="/marketplace" className="nav-link">Marketplace</NavLink>
      </div>

      <div className="navbar-right">
        <span className="username">{fullName}</span>

        <img
          src={profilePic}
          alt="Profile"
          className="profile-pic"
        />

        <button
          className="mode-toggle"
          onClick={() => setDark(d => !d)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
