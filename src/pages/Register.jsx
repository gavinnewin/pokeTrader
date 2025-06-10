import React, { useState } from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel from "../components/AuthLeftPanel";
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

// Ensure API URL doesn't end with a slash
const API = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting registration with API:', API);
      
      // First register the user
      const registerRes = await axios.post(`${API}/api/auth/register`, {
        fullName,
        email,
        password
      });

      console.log('Registration successful, attempting login');

      // Then automatically log them in
      const loginRes = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      });

      // Store the user data
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("fullName", loginRes.data.user.fullName);
      localStorage.setItem("email", loginRes.data.user.email);

      // Redirect to home page
      navigate('/home');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting Google signup with API:', API);
      
      const res = await axios.post(`${API}/api/auth/google-login`, {
        credential: credentialResponse.credential
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem('email', res.data.email); 
      localStorage.setItem("profilePic", res.data.profilePic);

      navigate('/home');
    } catch (err) {
      console.error('Google signup error:', err.response?.data || err.message);
      setError(err.response?.data?.error || "Google sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign up failed. Please try again.");
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
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isLoading}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button 
            className="login-btn" 
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

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
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
