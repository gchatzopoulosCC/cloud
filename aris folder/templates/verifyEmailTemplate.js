module.exports = (verificationUrl) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Welcome to Our Service!</h2>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}" style="color: #007bff; text-decoration: none;">Verify Email</a>
    <p>If you didn't register, please ignore this email.</p>
    <p>Best Regards,<br>Your Company</p>
  </div>
`;
