// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar  from "./components/Navbar";

import Home    from "./pages/Home";
import Search  from "./pages/Search";

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
          </Routes>
        </main>
      </div>
    </div>
  );
}
