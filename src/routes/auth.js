const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
require('dotenv').config();

// Serve registration form
router.get('/register', (req, res) => {
  res.send(
    <form action="/auth/register" method="POST">
      <h1>Register</h1>
      <input type="text" name="username" placeholder="Username" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
});

// Serve login form
router.get('/login', (req, res) => {
  res.send(
    <form action="/auth/login" method="POST">
      <h1>Login</h1>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
});

// Serve forgot password form
router.get('/forgot-password', (req, res) => {
  res.send(
    <form action="/auth/forgot-password" method="POST">
      <h1>Forgot Password</h1>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        required
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
});

// Serve reset password form
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  res.send(
    <form action="/auth/reset-password/${token}" method="POST">
      <h1>Reset Password</h1>
      <input
        type="password"
        name="password"
        placeholder="Enter new password"
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
});

// Handle user registration
router.post('/register', authController.register);

// Handle user login
router.post('/login', authController.login);

// Handle user logout
router.post('/logout', authController.logout);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
