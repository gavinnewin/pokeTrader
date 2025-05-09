import React from "react";
import './Login.css'; // reuse same CSS
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel from "../components/AuthLeftPanel";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/home');
  };

  return (
    <div className="login-page">
      <AuthLeftPanel />

      <div className="login-right">
        <div className="login-right-content">
          <h2>Create Your Account</h2>
          <p>Sign up</p>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <button className="login-btn" onClick={handleRegister}>Register</button>
          <p className="signup-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
