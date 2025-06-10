const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('GOOGLE_CLIENT_ID is not defined in environment variables');
}
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
}
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not defined in environment variables');
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }


    const user = new User({
      fullName,
      email,
      password
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});


// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google login
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      console.error('No credential provided in request');
      return res.status(400).json({ error: 'No credential provided' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('Verifying Google token with client ID:', process.env.GOOGLE_CLIENT_ID);
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log('Google token verified successfully for email:', payload.email);

    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      console.log('Creating new user for Google login:', email);
      // Create new user if doesn't exist
      user = new User({
        email,
        fullName: name,
        password: Math.random().toString(36).slice(-8), // Random password for Google users
        profilePic: picture
      });
      await user.save();
      console.log('New user created successfully');
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);

    res.json({
      token,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.error('Google login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Google login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No user found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error sending reset email' });
    }

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Error processing password reset request' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    await resend.emails.send({
      from: 'PokeTrader <noreply@poketrader.com>',
      to: user.email,
      subject: 'Your Password Has Been Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p>Hello ${user.fullName},</p>
          <p>Your password has been successfully reset. If you did not make this change, please contact us immediately.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `
    });

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

module.exports = router; 