// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar  from "./components/Navbar";
import Home    from "./pages/Home";
import Search  from "./pages/Search";
import Profile  from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/search"  element={<Search />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/settings"  element={<SettingsPage />} />
            <Route path="/logout"    element={<Logout />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
