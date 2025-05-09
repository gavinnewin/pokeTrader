// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Settings, LogOut } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/"         end   className="sidebar-logo">
        <img src="/pokeball.png" alt="Logo" />
      </NavLink>

      <div className="sidebar-icons">
        <NavLink to="/profile" className="sidebar-icon">
          <User size={24} />
        </NavLink>
        <NavLink to="/settings" className="sidebar-icon">
          <Settings size={24} />
        </NavLink>
        <NavLink to="/logout"   className="sidebar-icon">
          <LogOut size={24} />
        </NavLink>
      </div>
    </aside>
  );
}
