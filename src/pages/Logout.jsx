// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const nav = useNavigate();
  useEffect(() => {
    // TODO: call your auth logout function here
    // auth.signOut().then(() => nav("/"));
    console.log("Logging out…");
    nav("/login");
  }, [nav]);

  return <p>Logging you out…</p>;
}
