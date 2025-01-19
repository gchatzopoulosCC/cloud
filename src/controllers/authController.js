const { User } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !password ||
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return res
      .status(400)
      .send(
        'Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.'
      );
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });

    res.status(201).send('User registered successfully.');
  } catch (error) {
    res.status(500).send('Server error during registration: ' + error.message);
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid email or password.');
    }

    // Save user ID in session
    req.session.userId = user.id;

    // Set a custom cookie
    res.cookie('loggedIn', true, {
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      maxAge: 3600000, // 1 hour
    });

    res.send('Login successful');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// User logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.clearCookie('connect.sid'); // Clear session cookie
    res.clearCookie('loggedIn'); // Clear custom cookie
    res.send('Logout successful');
  });
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    res.send('Password reset email sent.');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });
    if (!user)
      return res.status(400).send('Invalid or expired password reset token.');

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.send('Password reset successfully');
  } catch (error) {
    res.status(500).send('Server error during password reset');
  }
};
