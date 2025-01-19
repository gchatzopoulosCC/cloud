require('dotenv').config();

module.exports = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <h2 style="color: ${
      process.env.BRAND_COLOR || '#007bff'
    };">Reset Your Password</h2>
    <p>
      We received a request to reset your password. If you made this request, click the link below to set a new password:
    </p>
    <a href="${resetUrl}" style="
      display: inline-block; 
      padding: 10px 15px; 
      background-color: ${process.env.BRAND_COLOR || '#007bff'}; 
      color: #fff; 
      text-decoration: none; 
      border-radius: 5px; 
      font-weight: bold;">
      Reset Password
    </a>
    <p>
      If you didn’t request a password reset, please ignore this email or contact our support team if you have concerns.
    </p>
    <p style="margin-top: 20px; font-size: 0.9em;">
      <strong>Security Tip:</strong> Always ensure the link redirects to our official website at <a href="${
        process.env.WEBSITE_URL || '#'
      }">${process.env.WEBSITE_URL || 'our website'}</a>.
    </p>
    <p style="font-size: 0.9em; margin-top: 30px; color: #666;">
      If you have any questions, feel free to contact us at <a href="mailto:${
        process.env.SUPPORT_EMAIL || 'support@example.com'
      }">${process.env.SUPPORT_EMAIL || 'support@example.com'}</a>.
    </p>
    <p>Best Regards,<br>${process.env.COMPANY_NAME || 'Your Company'}</p>
  </div>
`;
