import React from "react";
import { Home, User, Settings } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Home size={24} className="sidebar-icon" />
      <User size={24} className="sidebar-icon" />
      <Settings size={24} className="sidebar-icon" />
    </aside>
  );
}
