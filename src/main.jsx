// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";    // ← add this
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";
import "./global.css";

const GOOGLE_CLIENT_ID = "435567560693-pnmqmb8t5to8mcpmk4udbkjnul0pdviv.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>           {/* ← wrap here */}
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
