import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

function createEmailHtml(title, name, message, linkText, linkUrl) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Evergreen Inventory</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="font-size: 20px; color: #007bff;">${title}</h2>
        <p>Hello ${name},</p>
        <p>${message}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${linkUrl}" style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">${linkText}</a>
        </div>
        <p>If you did not request this, please ignore this email. This link will expire in 15 minutes.</p>
        <p>Thanks,<br/>The Evergreen Team</p>
      </div>
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777;">
        &copy; ${new Date().getFullYear()} Evergreen Inventory. All rights reserved.
      </div>
    </div>
  `;
}

export async function sendPasswordResetEmail(to, name, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Your Password Reset Link for Evergreen Inventory',
    html: createEmailHtml(
      'Password Reset Request',
      name,
      'We received a request to reset your password. Click the button below to set a new password:',
      'Reset Your Password',
      resetLink
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', to);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send email.');
  }
}

export async function sendVerificationEmail(to, name, verificationLink) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Verify Your Email for Evergreen Inventory',
      html: createEmailHtml(
        'Email Verification',
        name,
        'Thanks for signing up! Please verify your email address by clicking the button below:',
        'Verify Email Address',
        verificationLink
      ),
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Verification email sent to:', to);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Could not send email.');
    }
} 