import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";

import "./App.css";

function App() {
  const location = useLocation();
const isLoginPage = location.pathname === "/login" || location.pathname === "/register";

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-area">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Home />} />
            <Route path="/search"  element={<Search />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/settings"  element={<SettingsPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/logout"    element={<Logout />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
