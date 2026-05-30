import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'noreply@sportshq.app';

export async function sendVerificationEmail(
  email: string,
  confirmationUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your SportsHQ email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to SportsHQ!</h2>
          <p>Click the button below to verify your email and activate your account.</p>
          <a href="${confirmationUrl}" style="display: inline-block; background-color: #00f0ff; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy this link: ${confirmationUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            If you didn't create this account, you can ignore this email.
          </p>
        </div>
      `,
    });
    return result;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your SportsHQ password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #00f0ff; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy this link: ${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            If you didn't request this, you can ignore this email.
          </p>
        </div>
      `,
    });
    return result;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}
