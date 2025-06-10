import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

// Ensure API URL doesn't end with a slash
const API = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5174';

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API}/api/auth/forgot-password`, { email });
      setMessage('Password reset instructions have been sent to your email.');
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Forgot password error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="forgot-password-modal">
      <div className="forgot-password-content">
        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you instructions to reset your password.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          
          <div className="button-group">
            <button type="submit" className="submit-btn">Send Reset Link</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
} 