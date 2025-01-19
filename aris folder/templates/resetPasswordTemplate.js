module.exports = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the link below to set a new password:</p>
    <a href="${resetUrl}" style="color: #007bff; text-decoration: none;">Reset Password</a>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <p>Best Regards,<br>Your Company</p>
  </div>
`;
