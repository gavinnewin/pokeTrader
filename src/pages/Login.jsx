import React from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel from "../components/AuthLeftPanel";




const logo = "/pokeball.png";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <div className="login-page">
      <AuthLeftPanel />


      <div className="login-right">
        <div className="login-right-content">
          <h2>Welcome Back!</h2>
          <p>Sign in</p>
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <a href="#">Forgot Password?</a>
          <button className="login-btn" onClick={handleLogin}>Login</button>
          <p className="signup-text">Don’t have an account? <a href="/register">Signup</a></p>
          <div className="or-divider"><span>or</span></div>
          <button className="facebook-btn">Login with Facebook</button>
          <button className="google-btn">Login with Google</button>
        </div>
      </div>
    </div>
  );
}
