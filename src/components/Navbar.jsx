// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/marketplace">Marketplace</Link>
      </div>
      <div className="navbar-right">
        Bessie Cooper
      </div>
    </nav>
  );
}
