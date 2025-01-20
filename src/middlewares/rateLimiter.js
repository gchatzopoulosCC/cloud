const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Limit login attempts to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // Default: 15 minutes
  max: process.env.LOGIN_RATE_LIMIT_MAX || 5, // Default: 5 attempts per window
  message:
    'Too many login attempts from this IP. Please try again after 15 minutes.',
});

// General rate limiter for other routes
const generalLimiter = rateLimit({
  windowMs: process.env.GENERAL_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // Default: 15 minutes
  max: process.env.GENERAL_RATE_LIMIT_MAX || 100, // Default: 100 requests per window
  message: 'Too many requests. Please try again later.',
});

module.exports = { loginLimiter, generalLimiter };
