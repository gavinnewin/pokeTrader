import React, { useState } from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import AuthLeftPanel from "../components/AuthLeftPanel";
import ForgotPassword from "../components/ForgotPassword";

// Ensure API URL doesn't end with a slash
const API = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const logo = "/pokeball.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log('Attempting login with API:', API);
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("fullName", res.data.user.fullName);
  localStorage.setItem("email", res.data.user.email);


      navigate('/home');
    } catch (err) {
      console.error('LOGIN ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API}/api/auth/google-login`, {
        credential: credentialResponse.credential
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem('email', res.data.email); 
      localStorage.setItem("profilePic", res.data.profilePic);

      navigate('/home');
    } catch (err) {
      console.error('GOOGLE LOGIN ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.error || "Google login failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed");
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

          <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>
            Forgot Password?
          </a>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button className="login-btn" onClick={handleLogin}>Login</button>

          <p className="signup-text">
            Don't have an account? <a href="/register">Signup</a>
          </p>

          <div className="or-divider"><span>or</span></div>
          
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login;
