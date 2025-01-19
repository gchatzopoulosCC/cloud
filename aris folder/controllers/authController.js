const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User registration
const verifyEmailTemplate = require('../templates/verifyEmailTemplate');

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email is already registered.');
    }

    const emailToken = crypto.randomBytes(32).toString('hex');
    const newUser = new User({ username, email, password, emailToken });
    await newUser.save();

    const verificationUrl = `${process.env.BASE_URL}/auth/verify-email/${emailToken}`;
    const emailHtml = verifyEmailTemplate(verificationUrl);

    await transporter.sendMail({
      to: email,
      subject: 'Verify Your Email',
      html: emailHtml,
    });

    res
      .status(201)
      .send(
        'User registered successfully. Check your email to verify your account.'
      );
  } catch (error) {
    res.status(500).send('Server error during registration: ' + error.message);
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send('Invalid email or password.');
    }
    if (!user.emailVerified) {
      return res.status(401).send('Please verify your email to log in.');
    }

    // Save user ID in session
    req.session.userId = user._id;

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

// Email verification
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res
        .status(400)
        .send('Invalid or expired email verification token.');
    }
    user.emailVerified = true;
    user.emailToken = null;
    await user.save();
    res.send('Email verified successfully');
  } catch (error) {
    res.status(500).send('Server error during email verification');
  }
};

// Forgot password
const resetPasswordTemplate = require('../templates/resetPasswordTemplate');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;
    const emailHtml = resetPasswordTemplate(resetUrl);

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: emailHtml, // Use the HTML template
    });

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
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).send('Invalid or expired password reset token.');

    user.password = password; // Hashing will be handled by pre-save middleware
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.send('Password reset successfully');
  } catch (error) {
    res.status(500).send('Server error during password reset');
  }
};
