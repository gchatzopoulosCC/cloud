//const User = require('../models/User');
const userModel = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { Settings, validPlans } = require('../models/settingsModel');

// User registration
class authController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  async register(req, res) {
    const { name, email, password, plan } = req.body;

    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res
        .status(400)
        .json(
          'Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.'
        );
    }
    if (!validPlans.includes(plan)) {
      throw new Error(
        `Invalid plan. Valid plans are: ${validPlans.join(', ')}`
      );
    }

    try {
      // Get the id of the settings configuration
      // or create one if it doesn't exist
      const [settings] = await Settings.findOrCreate({
        where: {
          plan,
        },
      });

      // Validation
      if (plan && !validPlans.includes(plan)) {
        throw new Error(
          `Invalid plan. Valid plans are: ${validPlans.join(', ')}`
        );
      }

      // Check if email already exists
      const existingUser = await userModel.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json('Email is already registered.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.create({
        name,
        email,
        password: hashedPassword,
        plan,
        settingsId: settings.id,
      });

      res.status(201).json('User registered successfully.');
    } catch (error) {
      res
        .status(500)
        .json('Server error during registration: ' + error.message);
    }
  }

  // User login
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json('Invalid email or password.');
      }

      let isMatch;
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (error) {
        return res.status(500).json('Cannot compare passwords');
      }

      if (!isMatch) {
        return res.status(400).json('Invalid email or password.');
      }

      // Save user ID in session
      req.session.userId = user.id;

      // Set a custom cookie
      res.cookie('loggedIn', true, {
        httpOnly: true, // Prevent client-side access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: 3600000, // 1 hour
      });

      res.json('Login successful');
    } catch (error) {
      res.status(500).json('Server error');
    }
  }

  // User logout
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json('Error logging out');
      res.clearCookie('connect.sid'); // Clear session cookie
      res.clearCookie('loggedIn'); // Clear custom cookie
      res.json('Logout successful');
    });
  }

  // Forgot password
  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ where: { email } });
      if (!user) return res.status(404).json('User not found');
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      res.json('Password reset email sent.');
    } catch (error) {
      res.status(500).json('Server error');
    }
  }

  // Reset password
  async resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const user = await userModel.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: new Date() },
        },
      });
      if (!user)
        return res.status(400).json('Invalid or expired password reset token.');

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.json('Password reset successfully');
    } catch (error) {
      res.status(500).json('Server error during password reset');
    }
  }
}

module.exports = new authController();
