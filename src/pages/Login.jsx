import React, { useState } from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel from "../components/AuthLeftPanel";
import axios from 'axios';

const logo = "/pokeball.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem('email', res.data.email); 

      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <AuthLeftPanel />

      <div className="login-right">
        <div className="login-right-content">
          <h2>Welcome Back!</h2>
          <p>Sign in</p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <a href="#">Forgot Password?</a>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button className="login-btn" onClick={handleLogin}>Login</button>

          <p className="signup-text">
            Don’t have an account? <a href="/register">Signup</a>
          </p>

          <div className="or-divider"><span>or</span></div>

          <button className="facebook-btn">Login with Facebook</button>
          <button className="google-btn">Login with Google</button>
        </div>
      </div>
    </div>
  );
}
