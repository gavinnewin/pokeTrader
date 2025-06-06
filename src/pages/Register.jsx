import React, { useState } from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel from "../components/AuthLeftPanel";
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');

  const handleRegister = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        email,
        password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
        credential: credentialResponse.credential
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem('email', res.data.email); 
      localStorage.setItem("profilePic", res.data.profilePic);

      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || "Google sign up failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google sign up failed");
  };

  return (
    <div className="login-page">
      <AuthLeftPanel />

      <div className="login-right">
        <div className="login-right-content">
          <h2>Create Your Account</h2>
          <p>Sign up</p>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button className="login-btn" onClick={handleRegister}>Register</button>

          <p className="signup-text">
            Already have an account? <a href="/login">Login</a>
          </p>

          <div className="or-divider"><span>or</span></div>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
