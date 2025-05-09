// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";    // ← add this
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>           {/* ← wrap here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
