const rateLimit = require('express-rate-limit');

// Limit login attempts to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message:
    'Too many login attempts from this IP, please try again after 15 minutes.',
});

// General rate limiter for other routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

module.exports = { loginLimiter, generalLimiter };
